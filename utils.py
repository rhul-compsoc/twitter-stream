import sqlite3
import requests
import traceback
from constants import BEARER_TOKEN, DATABASE_FILE, TIME_FORMAT, VIDEO_ENDPOINT_URL
from datetime import datetime


def gen_bearer(r, token):
    r.headers["Authorization"] = f"Bearer {token}"
    return r


def gen_twitter_auth(r):
    return gen_bearer(r, BEARER_TOKEN)


def fetch(url, **kwargs):
    response = requests.get(url, **kwargs)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return dict(response.json())


# TODO: optismise by creating an authors table
def parse_response(search_response):
    if search_response["meta"]["result_count"] == 0:
        return []

    authors = {
        author["id"]: (author["username"], author["name"],
                       author["profile_image_url"])
        for author in search_response["includes"]["users"]
    }

    return [
        (
            tweet["id"],
            tweet["text"],
            *authors[tweet["author_id"]],
            created_at_convert(tweet["created_at"]),
            2,
        )
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
        # connection.set_trace_callback(print) # <--- useful for debugging
        connection.row_factory = dict_factory
        connection.text_factory = lambda x: x.decode("utf-8")
    except sqlite3.Error as err:
        print("Error connecting to database", err)
    return connection, connection.cursor()


def print_all():
    con, cur = get_connection()
    cur.execute("SELECT * FROM tweets")
    print(cur.fetchall())
    con.close()


def execute_many(statement: str, data):
    con, cur = get_connection()
    for row in data:
        try:
            cur.execute(statement, row)
        except:
            traceback.print_exc()
    con.commit()
    con.close()

# pass a list of tweet IDs with gifs and it'll return the IDs and the gif URLs [{id, url}...]
def getGifURLs(tweet_ids: list):
    params = {
        id: ','.join(tweet_ids)
    }
    response = fetch(VIDEO_ENDPOINT_URL, params)
    out = []
    for x in response:
        try:
            # it's long and it might fail, but it will fail nicely
            vidUrl = x.extended_entities.media[0].video_info.variants[0].url
            out.push({"id": x.id, "url": vidUrl })
        except:
            print("I couldn't get a gif for a tweet that was supposed to have one :(")
    return out
