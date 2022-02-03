from functools import wraps
import json
import os
import sqlite3

from flask import Flask, redirect, render_template, request, jsonify, session, url_for
from flask_cors import CORS
from flask_session import Session
from time import sleep
from threading import Thread
from traceback import print_last

from constants import (
    AUTH_TYPES,
    ENDPOINT_URL,
    HASHTAG,
    HTTP_CODE_NOT_FOUND,
    HTTP_METHOD_POST,
    REDIRECT_PATH,
    SCOPE,
    SEARCH_QUERY,
    TENANT_ID,
)
from msal_utils import (
    _build_msal_app,
    _get_token_from_cache,
    _load_cache,
    _save_cache,
)
from utils import execute_many, gen_twitter_auth, get_connection, fetch, parse_response

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

app.config["JSON_SORT_KEYS"] = False
app.config["SESSION_TYPE"] = "filesystem"

Session(app)

from werkzeug.middleware.proxy_fix import ProxyFix

app.wsgi_app = ProxyFix(app.wsgi_app, x_proto=1, x_host=1)


def protect_route(f):
    @wraps(f)
    def wrap(*args, **kwargs):
        token = _get_token_from_cache(SCOPE)
        if not token:
            return redirect(url_for("login"))
        return f(*args, **kwargs)

    return wrap


def latest_id():
    lastest_tweet = ""
    try:
        con, cursor = get_connection()

        cursor.execute("SELECT TWEET_ID FROM tweets ORDER BY TWEET_TIME DESC LIMIT 1")
        lastest_tweet = cursor.fetchone()

    except sqlite3.Error as err:
        print("Error connecting to database", err)
    finally:
        con.close()

    return lastest_tweet


@app.route("/update_db", methods=[HTTP_METHOD_POST])
@protect_route
def add_new_tweets():
    try:
        con, cursor = get_connection()
        lastest_tweet = latest_id()

        # if there are no tweets in the db, prevent Nonetype subscription
        lastest_tweet_id = {} if not lastest_tweet else {"since_id": lastest_tweet["TWEET_ID"]}

        search_result = fetch(
            ENDPOINT_URL,
            params={**SEARCH_QUERY, **lastest_tweet_id},
            auth=gen_twitter_auth,
        )

        parsed_response = parse_response(search_result)

        execute_many(
            "INSERT INTO tweets VALUES (?, ?, ?, ?, ?, ?, ?)",
            parsed_response,
        )
    except sqlite3.Error as err:
        print("Error connecting to database", err)
    finally:
        con.close()

    return redirect(url_for("panel"))


def fetch_by_auth(authType):
    tweets = ""
    try:
        con, cursor = get_connection()

        cursor.execute(
            "SELECT * from tweets WHERE AUTHORIZED=? ORDER BY TWEET_TIME DESC", (authType.value,)
        )

        tweets = cursor.fetchall()
    except sqlite3.Error as err:
        print("Error connecting to database", err)
    finally:
        con.close()

    return tweets


def set_tweet_auth(auth, tweet_id):
    try:
        con, cursor = get_connection()

        cursor.execute(
            "UPDATE tweets SET AUTHORIZED = ? WHERE TWEET_ID = ?",
            (
                auth,
                tweet_id,
            ),
        )

        con.commit()
    except sqlite3.Error as err:
        print("Error connecting to database", err)
    finally:
        con.close()


@app.route("/update_tweet_auth", methods=[HTTP_METHOD_POST])
@protect_route
def update_tweet_auth():
    tweet_id = request.args.get("id")
    auth = request.args.get("auth")

    validated = auth.isdecimal() and abs(int(auth)) <= 2

    if validated:
        set_tweet_auth(int(auth), tweet_id)
    # else flash an error
    return redirect(request.referrer or url_for("panel"))


@app.route("/panel")
@protect_route
def panel():
    filter_type = request.args.get("filter")
    if not (filter_type in AUTH_TYPES.__members__.keys()):
        return redirect("/panel?filter=NEW")

    return render_template(
        "panel.jinja",
        tweets=fetch_by_auth(AUTH_TYPES[filter_type]),
        filter_type=request.args.get("filter"),
    )


@app.route("/good_tweets")
def good_tweets():
    return jsonify(fetch_by_auth(AUTH_TYPES.GOOD))


@app.route("/")
def index():
    return render_template(
        "wall.jinja",
        hashtag=HASHTAG,
        tweets=json.dumps(fetch_by_auth(AUTH_TYPES.GOOD)),
    )


@app.route(REDIRECT_PATH)  # Its absolute URL must match your app's redirect_uri set in AAD
def authorized():
    try:
        cache = _load_cache()
        result = _build_msal_app(cache=cache).acquire_token_by_auth_code_flow(
            session.get("flow", {}), request.args
        )
        if "error" in result:
            return render_template("auth_error.html", result=result)
        session["user"] = result.get("id_token_claims")
        _save_cache(cache)
    except ValueError:  # Usually caused by CSRF
        pass  # Simply ignore them
    return redirect(url_for("panel"))


@app.route("/logout")
def logout():
    session.clear()  # Wipe out user and its token cache from session
    return redirect(  # Also logout from your tenant's web session
        f"https://login.microsoftonline.com/{TENANT_ID}"
        + "/oauth2/v2.0/logout"
        + "?post_logout_redirect_uri="
        + url_for("index", _external=True)
    )


@app.route("/login")
def login():
    token = _get_token_from_cache(SCOPE)
    if token:
        return redirect(url_for("panel"))

    session["flow"] = _build_msal_app().initiate_auth_code_flow(
        SCOPE, redirect_uri=url_for("authorized", _external=True)
    )

    return render_template("login.jinja", auth_url=session["flow"]["auth_uri"])


@app.errorhandler(HTTP_CODE_NOT_FOUND)
def page_not_found(e):
    return "<h1>404</h1>", HTTP_CODE_NOT_FOUND


def refresh_database_thread():
    while 1:
        try:
            print("Updating the tweet database.")
            add_new_tweets()
        except Exception as e:
            print_last()
        sleep(10)


@app.route("/api/since_id")
def since_id():
    # hashtag to search
    hashtag = request.args.get("hash")
    print(hashtag)
    if not hashtag:
        return "hashtag was not included. bad request", 400
    # id to limit recent tweets to
    tweet_id = request.args.get("id")

    return jsonify(
        fetch(
            ENDPOINT_URL,
            params={
                "query": f"#{hashtag}",
                "expansions": "author_id",
                # ISO 8601
                "tweet.fields": "created_at",
                "user.fields": "profile_image_url,username",
                "max_results": 100,
                **(tweet_id or {}),
            },
            auth=gen_twitter_auth,
        )
    )


if __name__ == "__main__":
    if not os.path.isfile("./TWEETS.db"):
        raise Exception("Initialise data base first pls")
    app.run(debug=True, host="0.0.0.0", port=5000)

    # Start the database updater thread
    t = Thread(target=refresh_database_thread, args=())
    t.start()
