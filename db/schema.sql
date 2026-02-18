-- Database schema for Serendipitous
-- Reset the database
DROP TABLE IF EXISTS message;
DROP TABLE IF EXISTS connection;
DROP TABLE IF EXISTS location_ping;
DROP TABLE IF EXISTS user_interest;
DROP TABLE IF EXISTS interest;
DROP TABLE IF EXISTS "user";

-- 1. USER Table
CREATE TABLE "user" (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    age INT,
    university VARCHAR(255),
    major VARCHAR(255),
    hometown VARCHAR(255),
    quote TEXT,
    location_lat FLOAT,
    location_lng FLOAT,
    interest_threshold INT DEFAULT 1,
    join_date DATE DEFAULT CURRENT_DATE,
    profile_photo VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. INTEREST Table
CREATE TABLE interest (
    interest_id SERIAL PRIMARY KEY,
    interest_name VARCHAR(100) NOT NULL
);

-- 3. USER_INTEREST Table
CREATE TABLE user_interest (
    user_interest_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    interest_id INT REFERENCES interest(interest_id) ON DELETE CASCADE
);

-- 4. LOCATION_PING Table
CREATE TABLE location_ping (
    ping_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    latitude FLOAT NOT NULL,
    longitude FLOAT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    share_location BOOLEAN DEFAULT TRUE
);

-- 5. CONNECTION Table
CREATE TABLE connection (
    connection_id SERIAL PRIMARY KEY,
    user_1_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    user_2_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    status VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. MESSAGE Table
CREATE TABLE message (
    message_id SERIAL PRIMARY KEY,
    sender_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    receiver_id INT REFERENCES "user"(user_id) ON DELETE CASCADE,
    connection_id INT REFERENCES connection(connection_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);