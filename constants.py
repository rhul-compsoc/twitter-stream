import dotenv

# general
DATABASE_FILE = "TWEETS.db"
HASHTAG = "hackawaytest2021"

# twitter stuff
BEARER_TOKEN = dotenv.get_key(".env.development", "BEARER_TOKEN")

# https://developer.twitter.com/en/docs/twitter-api/tweets/search/introduction
ENDPOINT_URL = "https://api.twitter.com/2/tweets/search/recent"

# @TODO: exclude any tweet with url/pictures
SEARCH_QUERY = {
    "query": f"#{HASHTAG}",
    "expansions": "author_id",
    # ISO 8601
    "tweet.fields": "created_at",
}

# HTTP STATUS CODES
HTTP_CODE_NOT_FOUND = 404
HTTP_CODE_BAD_AUTH = 401

# HTTP METHODS
HTTP_METHOD_POST = "POST"
HTTP_METHOD_GET = "GET"


# ISO 8601 strptime
TIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f%z"

SQL_SELECT_AUTH_TYPE = {"all": "AUTHORIZED", "bad": "0", "good": "1"}
