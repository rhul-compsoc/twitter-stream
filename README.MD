# twitter-stream

This is a project that serves a moderated twitter timeline from a chosen hashtag

## Running

-   Install dependencies with `pip3 install -r requirements.txt`

-   Initialise the database by running the `python3 init_db.py` and follow the instructions

-   Start the server with `python3 app.py`

## TODO

-   turns out using `cursor.executemany()` is actually slower then chunking yourself, bring back old implementation
-   set up working auth (just use a decorator for protected routes)
