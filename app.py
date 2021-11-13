from functools import wraps
from flask import Flask, redirect, render_template, request
import sqlite3

from constants import DATABASE_FILE, HTTP_CODE_NOT_FOUND, HTTP_METHOD_POST


app = Flask(__name__)


def is_authenticated(func):
    @wraps(func)
    def check_auth(*args, **kwargs):
        fornow = False
        if fornow:
            return redirect("/login")
        return func(*args, **kwargs)

    return check_auth


def query_db_auth(authType: str):
    tweets = []
    try:
        con = sqlite3.connect(DATABASE_FILE)
        con.row_factory = sqlite3.Row
        cursor = con.cursor()
        cursor.execute(f"SELECT * FROM tweets WHERE AUTHORIZED = {authType}")
        tweets = cursor.fetchall()
    except sqlite3.Error as err:
        print("Something went wrong", err)
    finally:
        con.close()

    return tweets


@app.route("/")
def index():
    return render_template("timeline.jinja", tweets=query_db_auth("1"))


@app.route("/login")
def login():
    return "<h1>login</h1>"


@app.route("/panel")
@is_authenticated
def panel():
    if not ("filter" in request.args):
        return redirect("/panel?filter=all")

    filter_type = request.args["filter"]
    sql_selector = {"all": "AUTHORIZED", "bad": "0", "good": "1"}

    if not (filter_type in sql_selector):
        return redirect("/panel?filter=all")

    tweets = query_db_auth(sql_selector[filter_type])

    return render_template("panel.jinja", tweets=tweets)


@app.route("/update_tweets", methods=[HTTP_METHOD_POST])
@is_authenticated
def update_tweets():
    return "<h1>login</h1>"


@app.errorhandler(HTTP_CODE_NOT_FOUND)
def page_not_found(e):
    return "<h1>404</h1>", HTTP_CODE_NOT_FOUND


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
