import requests
from constants import BEARER_TOKEN


def genAuth(r):
    r.headers["Authorization"] = f"Bearer {BEARER_TOKEN}"
    return r


def search(url, params):
    response = requests.get(url, auth=genAuth, params=params)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return dict(response.json())


def parse_response(search_response):
    return [{}, {}]
