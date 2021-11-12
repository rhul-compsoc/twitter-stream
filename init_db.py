import sqlite3
from constants import DATABASE_FILE

connection = sqlite3.connect(DATABASE_FILE)


def main():
    print('Opened database successfully in file "{}"'.format(DATABASE_FILE))

    cursor = connection.cursor()

    # checking to see if any table exists
    cursor.execute(
        "SELECT name FROM sqlite_master WHERE type='table'")

    if len(cursor.fetchall()):
        print("Table already exists, exiting...")
        return

    connection.execute(
            """CREATE TABLE IF NOT EXISTS tweets (
	TWITTER_URL                     VARCHAR(10),
	TWEET_TEXT                      VARCHAR(10),
	TWEET_AUTHOR                    VARCHAR(10),
	TWEET_TIME                      VARCHAR(10),
	AUTHORIZED						INTEGER DEFAULT 0
)""")

    create_dummy_values = input(
        "No table exists, create dummy values? (y/n): ")
    if create_dummy_values != 'y':
        return

    print('Creating dummy values in database...')


if __name__ == "__main__":
    main()

print('Closing connection to database')
connection.close()
