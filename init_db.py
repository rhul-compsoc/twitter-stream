from constants import DATABASE_FILE, ENDPOINT_URL, SEARCH_QUERY
from utils import get_connection, fetch, parse_response


def main(connection, cursor):
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
    cursor.execute("SELECT * FROM tweets LIMIT 1")
    rows = cursor.fetchall()

    if len(rows) == 0:
        create_dummy_values = input("Table empty, create dummy values? (y/n): ")

        if create_dummy_values == "y" or create_dummy_values == "yes":
            print("Creating dummy values in database...")
            dummy_tweets = parse_response(fetch(ENDPOINT_URL, SEARCH_QUERY))[-4:]

            for dummy_tweet in dummy_tweets:
                cursor.execute(
                    "INSERT INTO tweets VALUES (?, ?, ?, ?, ?, ?)",
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
            main(connection, cursor)


if __name__ == "__main__":
    con, cur = get_connection()
    main(con, cur)
    print("Closing connection to database")
    con.close()
