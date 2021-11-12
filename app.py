from functools import wraps
from flask import Flask, redirect


# Initialise websever
app = Flask(__name__)


def root_required(func):
    @wraps(func)
    def check_root(*args, **kwargs):
        fornow = True
        if fornow:
            return redirect('/login')
    return check_root


def getTweets():
    return {}


@app.route('/')
def index():
    return '<h1>Test</h1>'


@app.route('/obs')
def obs():
    return '<h1>Test</h1>'


@app.route('/login')
def login():
    return '<h1>login</h1>'


@app.route('/panel')
@root_required
def panel():
    return '<h1>admin</h1>'


@app.errorhandler(404)
def page_not_found(e):
    return '<h1>404</h1>', 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=8000)
