from constants import DATABASE_FILE, ENDPOINT_URL, SEARCH_QUERY
from utils import execute_many, gen_twitter_auth, get_connection, fetch, parse_response


def main():
    con, cur = get_connection()
    print('Opened database successfully in file "{}"'.format(DATABASE_FILE))

    # Tweet ID has to be a varchar, it's too big to be an int!
    con.execute(
        """CREATE TABLE IF NOT EXISTS tweets (
    	TWEET_ID                        VARCHAR(20) NOT NULL PRIMARY KEY,
    	TWEET_TEXT                      VARCHAR(10),
    	TWEET_AUTHOR_USERNAME           VARCHAR(10),
    	TWEET_AUTHOR_NAME				VARCHAR(10),
    	TWEET_AUTHOR_PF_LINK			VARCHAR(10),
    	TWEET_TIME                      INTEGER,
        HAS_GIF                         BOOLEAN DEFAULT FALSE,
        GIF_URL                         VARCHAR(55) DEFAULT NULL,
        GIF_NAME                        VARCHAR(19) DEFAULT NULL,
    	AUTHORIZED						INTEGER DEFAULT 0
    )"""
    )

    cur.execute("SELECT * FROM tweets")
    rows = cur.fetchall()

    if len(rows) > 0:
        reset_db = input("Values detected, reset db? (y/n): ")
        if reset_db == "y" or reset_db == "yes":
            cur.execute("DELETE FROM tweets")
            con.commit()

    cur.execute("SELECT * FROM tweets")
    rows = cur.fetchall()

    if len(rows) == 0:
        create_dummy_values = input(
            "Table empty, create dummy values? (y/n): ")

        if create_dummy_values == "y" or create_dummy_values == "yes":
            print("Creating dummy values in database...")

            dummy_tweets = parse_response(
                fetch(ENDPOINT_URL, params=SEARCH_QUERY, auth=gen_twitter_auth)
            )[-4:]
            print(dummy_tweets)
            execute_many(
                """INSERT INTO tweets (
                    TWEET_ID,
                    TWEET_TEXT,
                    TWEET_AUTHOR_USERNAME,
                    TWEET_AUTHOR_NAME,
                    TWEET_AUTHOR_PF_LINK,
                    TWEET_TIME, 
                    HAS_GIF,
                    AUTHORIZED
                ) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)""",
                dummy_tweets,
            )

            con.commit()
    con.close()


if __name__ == "__main__":
    main()
