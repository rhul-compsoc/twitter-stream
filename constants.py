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
OFFICE_365_TENANT_ID = fetch_from_env("OFFICE_365_TENANT_ID")
OFFICE_365_CLIENT_ID = fetch_from_env("OFFICE_365_CLIENT_ID")
OFFICE_365_REDIRECT_URI = fetch_from_env("OFFICE_365_REDIRECT_URI")
OFFICE_365_CLIENT_SECRET = fetch_from_env("OFFICE_365_CLIENT_SECRET")
OAUTH_AUTHORIZE = (
    f"https://login.microsoftonline.com/{OFFICE_365_TENANT_ID}/oauth2/v2.0/authorize?"
    + urlencode(
        {
            "client_id": OFFICE_365_CLIENT_ID,
            "response_type": "code",
            "response_mode": "query",
            "scope": "User.Read",
            "prompt": "select_account",
            "redirect_uri": OFFICE_365_REDIRECT_URI,
        }
    )
)


OAUTH_TOKEN_URL = f"https://login.microsoftonline.com/{OFFICE_365_TENANT_ID}/oauth2/v2.0/token"
TOKEN_PARAMS = {
    "client_id": OFFICE_365_CLIENT_ID,
    "redirect_uri": OFFICE_365_REDIRECT_URI,
    "grant_type": "authorization_code",
    "client_secret": OFFICE_365_CLIENT_SECRET,
}
