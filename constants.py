from dotenv import get_key


def fetch_from_env(key: str) -> str:
    env_key = get_key(".env.development", key)
    if env_key == None:
        raise KeyError(f"{key} not found!")
    return env_key


# DATABASE
DATABASE_FILE = "TWEETS.db"
HASHTAG = "BlackFriday"
SQL_SELECT_AUTH_TYPE = {"all": "AUTHORIZED", "bad": "0", "good": "1"}

# TWITTER
BEARER_TOKEN = fetch_from_env("BEARER_TOKEN")
# https://developer.twitter.com/en/docs/twitter-api/tweets/search/introduction
ENDPOINT_URL = "https://api.twitter.com/2/tweets/search/recent"
# @TODO: exclude any tweet with url/pictures
SEARCH_QUERY = {
    "query": f"#{HASHTAG}",
    "expansions": "author_id",
    # ISO 8601
    "tweet.fields": "created_at",
}
# ISO 8601 strptime
TIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f%z"


# HTTP STATUS CODES
HTTP_CODE_NOT_FOUND = 404
HTTP_CODE_BAD_AUTH = 401
HTTP_CODE_BAD_REQUEST = 400

# HTTP METHODS
HTTP_METHOD_POST = "POST"
HTTP_METHOD_GET = "GET"
