-- Sample data for Serendipitous database

-- Insert Sample Users
INSERT INTO "user" (name, age, university, major, hometown, quote, location_lat, location_lng, profile_photo) VALUES
('Alex Chen', 21, 'UCLA', 'Computer Science', 'San Francisco, CA', 'Chaos is a ladder', 34.0689, -118.4452, 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop&crop=face'),
('Jordan Lee', 20, 'Berkeley', 'Data Science', 'Los Angeles, CA', 'Just vibing', 37.8722, -122.2597, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face'),
('Taylor Reed', 22, 'USC', 'Business', 'San Diego, CA', 'Living my best life', 34.0195, -118.2912, 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face');

-- Insert Sample Interests
INSERT INTO interest (interest_name) VALUES
('Rock climbing'),
('Make playlists'),
('Play volleyball'),
('Cook ramen'),
('Watch Succession'),
('Thrift shopping'),
('Sunset hikes'),
('Photography'),
('Skateboarding'),
('Vinyl records');

-- Link Users to Interests
INSERT INTO user_interest (user_id, interest_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 4), (1, 5), (1, 6), (1, 7),
(2, 8), (2, 9), (2, 10),
(3, 1), (3, 6), (3, 7);

-- Sample Connections
INSERT INTO connection (user_1_id, user_2_id, status) VALUES
(1, 2, 'accepted'),
(1, 3, 'pending');

-- Sample Messages
INSERT INTO message (sender_id, receiver_id, connection_id, content) VALUES
(1, 2, 1, 'Hey Jordan! Ready for the study session?'),
(2, 1, 1, 'Absolutely! Just finishing up lunch.');

-- Sample Location Pings
INSERT INTO location_ping (user_id, latitude, longitude, share_location) VALUES
(1, 34.0689, -118.4452, true),
(2, 37.8722, -122.2597, true),
(3, 34.0195, -118.2912, true);