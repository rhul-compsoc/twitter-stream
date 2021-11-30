from flask import Flask, redirect, render_template, request, jsonify
from constants import (
    ENDPOINT_URL,
    HTTP_CODE_NOT_FOUND,
    HTTP_METHOD_POST,
    MAX_BATCH,
    SEARCH_QUERY,
    SQL_SELECT_AUTH_TYPE,
)
from utils import execute_many, gen_twitter_auth, get_connection, fetch, parse_response

app = Flask(__name__)
app.config["JSON_SORT_KEYS"] = False


def latest_id():
    con, cursor = get_connection()

    cursor.execute("SELECT TWEET_ID FROM tweets ORDER BY TWEET_TIME DESC LIMIT 1")
    lastest_tweet = cursor.fetchone()
    con.close()

    return lastest_tweet


@app.route("/update_db", methods=[HTTP_METHOD_POST])
def add_new_tweets():

    lastest_tweet = latest_id()

    # if there are no tweets in the db, prevent Nonetype subscription
    lastest_tweet_id = {} if not lastest_tweet else {"since_id": lastest_tweet["TWEET_ID"]}

    search_result = fetch(
        ENDPOINT_URL,
        params={**SEARCH_QUERY, **lastest_tweet_id},
        auth=gen_twitter_auth,
    )

    parsed_response = parse_response(search_result)

    # at max we are adding 400 tweets at a time
    while "next_token" in search_result["meta"] and len(parsed_response) < MAX_BATCH:
        search_result = fetch(
            ENDPOINT_URL,
            params={
                **SEARCH_QUERY,
                **lastest_tweet_id,
                "next_token": search_result["meta"]["next_token"],
            },
            auth=gen_twitter_auth,
        )
        temp_parsed = parse_response(search_result)
        parsed_response.extend(temp_parsed)

        print(search_result["meta"]["next_token"], len(parsed_response), len(temp_parsed))

    execute_many(
        "INSERT INTO tweets VALUES (?, ?, ?, ?, ?, ?)",
        parsed_response,
    )

    return redirect("/panel")


def fetch_by_auth(authType: str):
    con, cursor = get_connection()

    cursor.execute(
        "SELECT * from tweets WHERE AUTHORIZED=? ORDER BY TWEET_TIME DESC", (authType,)
    )

    tweets = cursor.fetchall()

    con.close()

    return tweets


def set_tweet_auth(auth, tweet_id):
    con, cursor = get_connection()

    cursor.execute(
        "UPDATE tweets SET AUTHORIZED = ? WHERE TWEET_ID = ?",
        (
            auth,
            tweet_id,
        ),
    )

    con.commit()
    con.close()


@app.route("/update_tweet_auth", methods=[HTTP_METHOD_POST])
def update_tweet_auth():
    tweet_id = request.args.get("id")
    auth = request.args.get("auth")

    validated = auth.isdecimal() and (0 <= int(auth) and int(auth) <= 1)

    if validated:
        set_tweet_auth(int(auth), tweet_id)
    # else flash an error
    return redirect(request.referrer or "/panel")


@app.route("/panel")
def panel():
    filter_type = request.args.get("filter")
    if not (filter_type in SQL_SELECT_AUTH_TYPE):
        return redirect("/panel?filter=new")

    return render_template(
        "panel.jinja",
        tweets=fetch_by_auth(SQL_SELECT_AUTH_TYPE[filter_type]),
        filter_type=filter_type,
    )


@app.route("/good_tweets")
def good_tweets():
    return jsonify(fetch_by_auth(SQL_SELECT_AUTH_TYPE["good"]))


@app.route("/")
def index():
    return render_template("wall.jinja")


@app.route("/login")
def login_route():
    return render_template("login.jinja")


@app.errorhandler(HTTP_CODE_NOT_FOUND)
def page_not_found(e):
    return "<h1>404</h1>", HTTP_CODE_NOT_FOUND


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
