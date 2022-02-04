# twitter-stream

This is a project that serves a moderated twitter timeline from a chosen hashtag

## Running

-   Install dependencies with `pip3 install -r requirements.txt`

-   Initialise the database by running the `python3 init_db.py` and follow the instructions

-   Start the server with `python3 app.py`

-   Get elevated access for your project in twitter (you need elevated access for api v1.1?!?!)

## TODO

- the panels client file needs to request new information from the server periodically
  (that's why it wasn't updating automatically)
	I'll put in a timer to refresh the page every 10 seconds but come on boys, I see some slacking going on here 👀
- sort out that HTML 🤮🤮🤮
