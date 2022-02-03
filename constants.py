from enum import Enum
from dotenv import get_key


def fetch_from_env(key: str) -> str:
    env_key = get_key(".env", key)
    if env_key == None:
        raise KeyError(f"{key} not found!")
    return env_key


# DATABASE
DATABASE_FILE = "TWEETS.db"
HASHTAG = "80s90s00s"


class AUTH_TYPES(Enum):
    BAD = "0"
    GOOD = "1"
    NEW = "2"


# TWITTER
BEARER_TOKEN = fetch_from_env("BEARER_TOKEN")
# https://developer.twitter.com/en/docs/twitter-api/tweets/search/introduction
ENDPOINT_URL = "https://api.twitter.com/2/tweets/search/recent"
MAX_BATCH = 400
# @TODO: exclude any tweet with url/pictures
SEARCH_QUERY = {
    "query": f"#{HASHTAG}",
    "expansions": "author_id",
    # ISO 8601
    "tweet.fields": "created_at",
    "user.fields": "profile_image_url,username",
    "max_results": 100,
}
# ISO 8601 strptime
TIME_FORMAT = "%Y-%m-%dT%H:%M:%S.%f%z"

# Office contants
CLIENT_ID = fetch_from_env("OFFICE_365_CLIENT_ID")
CLIENT_SECRET = fetch_from_env("OFFICE_365_CLIENT_SECRET")
TENANT_ID = fetch_from_env("OFFICE_365_TENANT_ID")
SCOPE = ["User.ReadBasic.All"]
REDIRECT_PATH = "/redirect"

# Bypass Authentication (for testing purposes)
BYPASS_AUTHENTICATION = True if fetch_from_env("BYPASS_AUTHENTICATION") == "True" else False

# HTTP STATUS CODES
HTTP_CODE_NOT_FOUND = 404
HTTP_CODE_BAD_AUTH = 401
HTTP_CODE_BAD_REQUEST = 400

# HTTP METHODS
HTTP_METHOD_POST = "POST"
HTTP_METHOD_GET = "GET"
