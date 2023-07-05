-- Your SQL goes here

CREATE TABLE
    IF NOT EXISTS students (
        id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        age INTEGER NOT NULL
    );