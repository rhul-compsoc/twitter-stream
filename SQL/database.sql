CREATE TABLE IF NOT EXISTS tweets (
	tweet_id VARCHAR(20) NOT NULL PRIMARY KEY,
	tweet_text VARCHAR(240) NOT NULL,
	tweet_author_id VARCHAR(20) NOT NULL,
	tweet_author_name VARCHAR(20) NOT NULL,
	tweet_autoor_username VARCHAR(20) NOT NULL,
	tweet_author_created_at TIMESTAMP,
	tweet_author_profile_image_url VARCHAR(240)
);

CREATE TABLE IF NOT EXISTS processed (
	id SERIAL PRIMARY KEY,
	tweet_id VARCHAR(20) NOT NULL references tweets(tweet_id),
	process_result CHAR(1) NOT NULL,
	processed_at TIMESTAMP,
	processed_by VARCHAR(20)
);