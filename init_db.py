import sqlite3
from constants import DATABASE_FILE, ENDPOINT_URL, SEARCH_QUERY
from twitter import search


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
        "TWEET_TIME": first_tweet["created_at"],
        "AUTHORIZED": 1,
    }


connection = sqlite3.connect(DATABASE_FILE)
print('Opened database successfully in file "{}"'.format(DATABASE_FILE))

connection.execute(
    """CREATE TABLE IF NOT EXISTS tweets (
	TWEET_ID                        VARCHAR(10),
	TWEET_TEXT                      VARCHAR(10),
	TWEET_AUTHOR_USERNAME           VARCHAR(10),
	TWEET_AUTHOR_NAME				VARCHAR(10),
	TWEET_TIME                      VARCHAR(10),
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
        dummy_values = ", ".join(map(lambda a: f"'{str(a)}'", dummy_tweet.values()))
        cursor.execute(
            f"INSERT INTO tweets ({', '.join(dummy_tweet.keys())}) VALUES ({dummy_values})"
        )
        connection.commit()


print("Closing connection to database")
connection.close()
