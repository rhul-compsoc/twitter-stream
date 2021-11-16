from functools import wraps
from flask import Flask, redirect, render_template, request


from constants import (
    ENDPOINT_URL,
    HTTP_CODE_NOT_FOUND,
    HTTP_METHOD_POST,
    SEARCH_QUERY,
    SQL_SELECT_AUTH_TYPE,
)
from utils import get_connection, fetch, parse_response


app = Flask(__name__)


def is_authenticated(func):
    @wraps(func)
    def check_auth(*args, **kwargs):
        fornow = False
        if fornow:
            return redirect("/login")
        return func(*args, **kwargs)

    return check_auth


def update_db():
    con, cursor = get_connection()

    cursor.execute("SELECT * FROM tweets ORDER BY TWEET_TIME DESC LIMIT 1")
    lastest_tweet_id = cursor.fetchone()["TWEET_ID"]

    new_tweets = parse_response(
        fetch(ENDPOINT_URL, {**SEARCH_QUERY, "since_id": lastest_tweet_id})
    )

    print(new_tweets)
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


@app.route("/login")
def login():
    return "<h1>login</h1>"


@app.route("/panel")
@is_authenticated
def panel():
    update_db()
    if not ("filter" in request.args):
        return redirect("/panel?filter=all")

    filter_type = request.args["filter"]

    if not (filter_type in SQL_SELECT_AUTH_TYPE):
        return redirect("/panel?filter=all")

    tweets = query_db_auth(SQL_SELECT_AUTH_TYPE[filter_type])

    return render_template("panel.jinja", tweets=tweets, filter_type=filter_type)


@app.route("/update_tweets", methods=[HTTP_METHOD_POST])
@is_authenticated
def update_tweets():
    return "<h1>update</h1>"


@app.errorhandler(HTTP_CODE_NOT_FOUND)
def page_not_found(e):
    return "<h1>404</h1>", HTTP_CODE_NOT_FOUND


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
