import requests
from constants import BEARER_TOKEN, ENDPOINT_URL, SEARCH_QUERY


def genAuth(r):
    r.headers["Authorization"] = f"Bearer {BEARER_TOKEN}"
    return r


def search(url, params):
    response = requests.get(url, auth=genAuth, params=params)
    if response.status_code != 200:
        raise Exception(response.status_code, response.text)
    return dict(response.json())


def main():
    dict_response = search(ENDPOINT_URL, SEARCH_QUERY)
    print(dict_response)


if __name__ == "__main__":
    main()
