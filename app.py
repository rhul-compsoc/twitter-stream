from crypt import methods
from functools import wraps
from flask import Flask, redirect

from constants import HTTP_CODE_NOT_FOUND, HTTP_METHOD_POST


app = Flask(__name__)


def is_authenticated(func):
    @wraps(func)
    def check_auth(*args, **kwargs):
        fornow = False
        if fornow:
            return redirect('/login')
    return check_auth


@app.route('/')
def index():
    return '<h1>Test</h1>'


@app.route('/login')
def login():
    return '<h1>login</h1>'


@app.route('/panel')
@is_authenticated
def panel():
    return '<h1>admin</h1>'


@app.route('/api/update_tweets', methods=[HTTP_METHOD_POST])
@is_authenticated
def update_tweets():
    return True


@app.route('/api/get_tweets')
def get_tweets():
    return []


@app.errorhandler(HTTP_CODE_NOT_FOUND)
def page_not_found(e):
    return '<h1>404</h1>', HTTP_CODE_NOT_FOUND


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
