import sqlite3
from constants import DATABASE_FILE, ENDPOINT_URL, SEARCH_QUERY, TIME_FORMAT
from twitter import search
from datetime import datetime, timezone


def dummy_value():
    res = search(ENDPOINT_URL, SEARCH_QUERY)
    first_tweet = res["data"][0]
    authors = res["includes"]["users"]
    first_tweet_author = [
        author for author in authors if author["id"] == first_tweet["author_id"]
    ][0]

    return {
        "TWEET_ID": first_tweet["id"],
        "TWEET_TEXT": first_tweet["text"],
        "TWEET_AUTHOR_USERNAME": first_tweet_author["username"],
        "TWEET_AUTHOR_NAME": first_tweet_author["name"],
        "TWEET_TIME": int(datetime.strptime(first_tweet["created_at"], TIME_FORMAT).timestamp()),
        "AUTHORIZED": 1,
    }


def main(connection):
    print('Opened database successfully in file "{}"'.format(DATABASE_FILE))

    connection.execute(
        """CREATE TABLE IF NOT EXISTS tweets (
    	TWEET_ID                        VARCHAR(10),
    	TWEET_TEXT                      VARCHAR(10),
    	TWEET_AUTHOR_USERNAME           VARCHAR(10),
    	TWEET_AUTHOR_NAME				VARCHAR(10),
    	TWEET_TIME                      INTEGER,
    	AUTHORIZED						INTEGER DEFAULT 0
    )"""
    )
    cursor = connection.cursor()
    cursor.execute("SELECT * FROM tweets LIMIT 1")
    rows = cursor.fetchall()

    if len(rows) == 0:
        create_dummy_values = input("Table empty, create dummy values? (y/n): ")

        if create_dummy_values == "y" or create_dummy_values == "yes":
            print("Creating dummy values in database...")
            dummy_tweet = dummy_value()
            print(dummy_tweet)
            cursor.execute(
                f"INSERT INTO tweets (TWEET_ID, TWEET_TEXT, TWEET_AUTHOR_USERNAME, TWEET_AUTHOR_NAME, TWEET_TIME, AUTHORIZED) VALUES (?, ?, ?, ?, ?, ?)",
                (
                    dummy_tweet["TWEET_ID"],
                    dummy_tweet["TWEET_TEXT"],
                    dummy_tweet["TWEET_AUTHOR_USERNAME"],
                    dummy_tweet["TWEET_AUTHOR_NAME"],
                    dummy_tweet["TWEET_TIME"],
                    dummy_tweet["AUTHORIZED"],
                ),
            )
            connection.commit()
    else:
        reset_db = input("Values detected, reset db? (y/n): ")
        if reset_db == "y":
            cursor.execute("DROP table tweets")
            connection.commit()
            # probably a memory violation, idrc tho lol
            main(connection)


if __name__ == "__main__":
    con = sqlite3.connect(DATABASE_FILE)
    main(con)
    print("Closing connection to database")
    con.close()
