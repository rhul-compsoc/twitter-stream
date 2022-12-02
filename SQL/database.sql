CREATE TABLE IF NOT EXISTS tweets (
	tweet_id VARCHAR(20) NOT NULL PRIMARY KEY,
	tweet_text TEXT NOT NULL,
	tweet_created_at TIMESTAMP NOT NULL,
	tweet_author_id VARCHAR(20) NOT NULL,
	tweet_author_name VARCHAR(20) NOT NULL,
	tweet_author_username VARCHAR(20) NOT NULL,
	tweet_author_created_at TIMESTAMP,
	tweet_author_profile_image_url VARCHAR(240)
);

CREATE TABLE IF NOT EXISTS processed (
	id SERIAL PRIMARY KEY,
	tweet_id VARCHAR(20) references tweets(tweet_id) ON DELETE CASCADE NOT NULL,
	process_result CHAR(1) NOT NULL,
	processed_at TIMESTAMP,
	processed_by VARCHAR(20)
);