# twitter-stream

This is a project that serves a moderated twitter timeline from a chosen hashtag

## Running

-   Install dependencies with `pip3 install -r requirements.txt`

-   Initialise the database by running the `python3 init_db.py` and follow the instructions

-   Start the server with `python3 app.py`

-   Get elevated access for your project in twitter (you need elevated access for api v1.1?!?!)

## TODO

- modify the database to include whether or not the tweet has a gif and what the gif name (or and link) is
- add the tweets that contain gifs to a list so the gif (.mp4) can be downloaded and added to a folder
- request the download link for the tweet gif and download it 
- modify the tweet display page to include the gif
- modify the moderation page to include the gif
