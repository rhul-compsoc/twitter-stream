from urllib.parse import urlencode
from dotenv import get_key


def fetch_from_env(key: str) -> str:
    env_key = get_key(".env.development", key)
    if env_key == None:
        raise KeyError(f"{key} not found!")
    return env_key


# DATABASE
DATABASE_FILE = "TWEETS.db"
HASHTAG = "hackawaytest2021"
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

# HTTP METHODS
HTTP_METHOD_POST = "POST"
HTTP_METHOD_GET = "GET"

# Office 365
OAUTH_AUTHORISE = (
    "https://login.microsoftonline.com/252e00d0-e60f-47dd-90f6-5a6acf2b08b0/oauth2/v2.0/authorize?"
    + urlencode(
        {"client_id": fetch_from_env("CLIENT_ID"), "response_type": "code", "scope": "User.Read"}
    )
)
