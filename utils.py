import sqlite3
import requests
from constants import BEARER_TOKEN, DATABASE_FILE, TIME_FORMAT
from datetime import datetime


def genAuth(r):
    r.headers["Authorization"] = f"Bearer {BEARER_TOKEN}"
    return r


def get_bearer(code: str, session_state: str) -> str:
    return ""


def fetch(url, params):
    response = requests.get(url, auth=genAuth, params=params)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return dict(response.json())


# TODO: optismise by creating an authors database
def parse_response(search_response):
    print(search_response)
    if search_response["meta"]["result_count"] == 0:
        return []

    authors = {
        author["id"]: {
            "TWEET_AUTHOR_USERNAME": author["username"],
            "TWEET_AUTHOR_NAME": author["name"],
        }
        for author in search_response["includes"]["users"]
    }

    return [
        {
            "TWEET_ID": tweet["id"],
            "TWEET_TEXT": tweet["text"],
            **authors[tweet["author_id"]],
            "TWEET_TIME": created_at_convert(tweet["created_at"]),
            "AUTHORIZED": 0,
        }
        for tweet in search_response["data"]
    ]


def created_at_convert(twitter_time):
    return int(datetime.strptime(twitter_time, TIME_FORMAT).timestamp())


# https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.row_factory
def dict_factory(cursor, row):
    return {col[0]: row[idx] for idx, col in enumerate(cursor.description)}


def get_connection():
    try:
        connection = sqlite3.connect(DATABASE_FILE)
        connection.row_factory = dict_factory
    except sqlite3.Error as err:
        print("Error connecting to database", err)
    return connection, connection.cursor()
