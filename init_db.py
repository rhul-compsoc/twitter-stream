import sqlite3
from constants import DATABASE_FILE, ENDPOINT_URL, SEARCH_QUERY, TIME_FORMAT
from twitter import search, created_at_convert


def dummy_values():
    res = search(ENDPOINT_URL, SEARCH_QUERY)

    authors = {
        author["id"]: {
            "TWEET_AUTHOR_USERNAME": author["username"],
            "TWEET_AUTHOR_NAME": author["name"],
        }
        for author in res["includes"]["users"]
    }

    return [
        {
            "TWEET_ID": tweet["id"],
            "TWEET_TEXT": tweet["text"],
            **authors[tweet["author_id"]],
            "TWEET_TIME": created_at_convert(tweet["created_at"]),
            "AUTHORIZED": index % 2,
        }
        for index, tweet in enumerate(res["data"][-4:])
    ]


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
            dummy_tweets = dummy_values()

            for dummy_tweet in dummy_tweets:
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
