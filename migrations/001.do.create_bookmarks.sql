CREATE TABLE bookmark_reviews (
    id INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    bookmark_name TEXT NOT NULL,
    bookmark_website TEXT NOT NULL,
    bookmark_desc TEXT DEFAULT 'No Summary',
    bookmark_rating INTEGER NOT NULL
);