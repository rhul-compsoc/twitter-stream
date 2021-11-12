import sqlite3
from constants import DATABASE_FILE, ENDPOINT_URL, SEARCH_QUERY
from twitter import search

connection = sqlite3.connect(DATABASE_FILE)


def dummy_value():
    res = search(ENDPOINT_URL, SEARCH_QUERY)
    first_tweet = res['data'][0]
    authors = res['includes']['users']
    first_tweet_author = [
        author for author in authors if author['id'] == first_tweet['author_id']][0]
    return {
        'TWEET_ID': first_tweet['id'],
        'TWEET_TEXT': first_tweet['text'],
        'TWEET_AUTHOR_USERNAME': first_tweet_author['username'],
        'TWEET_AUTHOR_NAME': first_tweet_author['name'],
        'TWEET_TIME': first_tweet['created_at'],
        'AUTHORIZED': 1
    }


def main():
    print('Opened database successfully in file "{}"'.format(DATABASE_FILE))

    cursor = connection.cursor()

    # checking to see if any table exists
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table'")

    if len(cursor.fetchall()):
        overwrite = input("Table already exists, overwrite? (y/n): ")
        if overwrite != 'y':
            return
        # clearing table
        connection.execute(' DROP TABLE tweets;')

    connection.execute(
            """CREATE TABLE IF NOT EXISTS tweets (
	TWEET_ID                        VARCHAR(10),
	TWEET_TEXT                      VARCHAR(10),
	TWEET_AUTHOR_USERNAME           VARCHAR(10),
	TWEET_AUTHOR_NAME				VARCHAR(10),
	TWEET_TIME                      VARCHAR(10),
	AUTHORIZED						INTEGER DEFAULT 0
)""")

    create_dummy_values = input(
        "Table empty, create dummy values? (y/n): ")
    if create_dummy_values != 'y':
        return

    print('Creating dummy values in database...')
    dummy_tweet = dummy_value()
    dummy_values = ', '.join(
        map(lambda a: f"'{str(a)}'", dummy_tweet.values()))
    cursor.execute(
        f"INSERT INTO tweets ({', '.join(dummy_tweet.keys())}) VALUES ({dummy_values})")
    connection.commit()


if __name__ == "__main__":
    main()

print('Closing connection to database')
connection.close()
