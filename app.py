from flask import Flask, redirect, render_template, request
from constants import (
    ENDPOINT_URL,
    HTTP_CODE_NOT_FOUND,
    HTTP_METHOD_POST,
    SEARCH_QUERY,
    SQL_SELECT_AUTH_TYPE,
)
from utils import gen_twitter_auth, get_connection, fetch, parse_response


app = Flask(__name__)

# TODO: pagination
# since this is an expensive operation, maybe worth debouncing?
def add_new_tweets():
    con, cursor = get_connection()

    cursor.execute("SELECT * FROM tweets ORDER BY TWEET_TIME DESC LIMIT 1")
    lastest_tweet = cursor.fetchone()

    # if there are no tweets in the db, prevent Nonetype subscription
    lastest_tweet_id = {} if not lastest_tweet else {"since_id": lastest_tweet["TWEET_ID"]}

    cursor.executemany(
        "INSERT INTO tweets VALUES (?, ?, ?, ?, ?, ?)",
        parse_response(
            fetch(
                ENDPOINT_URL,
                params={**SEARCH_QUERY, **lastest_tweet_id},
                auth=gen_twitter_auth,
            )
        ),
    )

    con.commit()

    con.close()


# TODO: refactor this function, im not a fan
def fetch_by_auth(authType: str):
    con, cursor = get_connection()

    if authType != "AUTHORIZED":
        cursor.execute(
            "SELECT * from tweets WHERE AUTHORIZED=? ORDER BY TWEET_TIME DESC", authType
        )
    else:
        cursor.execute("SELECT * from tweets ORDER BY TWEET_TIME DESC")

    tweets = cursor.fetchall()

    con.close()

    return tweets


def set_tweet_auth(tweet_id, auth):
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

    validated = auth.isdecimal() and (0 < int(auth) and int(auth) <= 1)

    if validated:
        set_tweet_auth(tweet_id, int(auth))
    # else flash an error
    return redirect(request.referrer or "/panel")


@app.route("/panel")
def panel():
    filter_type = request.args.get("filter")
    if not (filter_type in SQL_SELECT_AUTH_TYPE):
        return redirect("/panel?filter=all")

    # check for any new tweets and add them to the db
    add_new_tweets()

    return render_template(
        "panel.jinja",
        tweets=fetch_by_auth(SQL_SELECT_AUTH_TYPE[filter_type]),
        filter_type=filter_type,
    )


@app.route("/")
def index():
    return render_template("timeline.jinja", tweets=fetch_by_auth(SQL_SELECT_AUTH_TYPE["good"]))


@app.route("/login")
def login_route():
    return render_template("login.jinja")


@app.errorhandler(HTTP_CODE_NOT_FOUND)
def page_not_found(e):
    return "<h1>404</h1>", HTTP_CODE_NOT_FOUND


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
