import dotenv

# general
DATABASE_FILE = "TWEETS.db"
HASHTAG = "hackawaytest2021"

# twitter stuff
BEARER_TOKEN = dotenv.get_key('.env.development', 'BEARER_TOKEN')
ENDPOINT_URL = "https://api.twitter.com/2/tweets/search/recent"
# @TODO: exclude any tweet with url/pictures
SEARCH_QUERY = {
    'query': f'#{HASHTAG}',
    'expansions': 'author_id',
    # ISO 8601
    'tweet.fields': 'created_at'
}
