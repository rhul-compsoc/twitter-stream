from datetime import datetime, timedelta
from functools import wraps
import secrets
from urllib.parse import urlencode
import requests
from flask import Flask, flash, make_response, redirect, render_template, request, url_for

from constants import (
    BEARER_TOKEN,
    ENDPOINT_URL,
    HTTP_CODE_NOT_FOUND,
    HTTP_METHOD_POST,
    OAUTH_AUTHORIZE,
    OAUTH_TOKEN_URL,
    SEARCH_QUERY,
    SQL_SELECT_AUTH_TYPE,
    TOKEN_PARAMS,
)
from utils import gen_bearer, gen_twitter_auth, get_connection, fetch, parse_response


app = Flask(__name__)
app.secret_key = secrets.token_urlsafe(16)

# refactor
def is_authenticated(func):
    @wraps(func)
    def check_auth(*args, **kwargs):
        access_token = request.cookies.get("access_token")
        authorized = False
        if access_token:
            try:
                res = fetch(
                    "https://graph.microsoft.com/v1.0/me",
                    auth=lambda r: gen_bearer(r, access_token),
                )
                authorized = True
            except Exception as e:
                authorized = False
        if not authorized:
            return redirect("/login")
        return func(*args, **kwargs)

    return check_auth


def update_db():
    con, cursor = get_connection()

    cursor.execute("SELECT * FROM tweets ORDER BY TWEET_TIME DESC LIMIT 1")
    lastest_tweet = cursor.fetchone()
    lastest_tweet_id = {} if not lastest_tweet else {"since_id": lastest_tweet["TWEET_ID"]}

    new_tweets = parse_response(
        fetch(
            ENDPOINT_URL,
            params={**SEARCH_QUERY, **lastest_tweet_id},
            auth=gen_twitter_auth,
        )
    )

    for tweet in new_tweets:
        cursor.execute("INSERT INTO tweets VALUES (?, ?, ?, ?, ?, ?)", tuple(tweet.values()))

    con.commit()
    con.close()


def query_db_auth(authType: str):
    tweets = []

    con, cursor = get_connection()
    cursor.execute(
        f"SELECT * FROM tweets WHERE AUTHORIZED = {authType} ORDER BY TWEET_TIME DESC"
    )
    tweets = cursor.fetchall()
    con.close()

    return tweets


@app.route("/")
def index():
    update_db()
    return render_template("timeline.jinja", tweets=query_db_auth("1"))


@app.route("/panel")
@is_authenticated
def panel():
    update_db()
    filter_type = request.args.get("filter")
    if not (filter_type in SQL_SELECT_AUTH_TYPE):
        return redirect("/panel?filter=all")

    tweets = query_db_auth(SQL_SELECT_AUTH_TYPE[filter_type])

    return render_template("panel.jinja", tweets=tweets, filter_type=filter_type)


@app.route("/update_tweets", methods=[HTTP_METHOD_POST])
@is_authenticated
def update_tweets():
    return "<h1>update</h1>"


# AUTH GOODNESS


@app.route("/login")
def login():

    return render_template("login.jinja", auth_url=OAUTH_AUTHORIZE)


@app.route("/redirect")
def oauth_redirect():
    code = request.args.get("code")
    if code == None:
        flash("Invalid query params", "error")
        return redirect("/login")

    response = requests.post(
        OAUTH_TOKEN_URL,
        {
            **TOKEN_PARAMS,
            "code": code,
        },
    )

    if response.status_code == 200:
        json_response = dict(response.json())
        res = make_response()

        res.set_cookie(
            "access_token",
            value=json_response["access_token"],
            expires=datetime.now() + timedelta(seconds=json_response["expires_in"]),
        )
        res.headers["location"] = url_for("panel")
        return res, 302
    else:
        flash("Failed, try again", "error")
        return redirect("/login")


@app.route("/logout")
def logout():
    return "<h1>good bye</h1>"


@app.errorhandler(HTTP_CODE_NOT_FOUND)
def page_not_found(e):
    return "<h1>404</h1>", HTTP_CODE_NOT_FOUND


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
