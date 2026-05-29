CREATE TABLE blogs (
    id SERIAL PRIMARY KEY,
    author TEXT,
    url TEXT NOT NULL,
    title TEXT NOT NULL,
    likes INTEGER DEFAULT 0
);

insert into blogs (author, url, title) values ('John DiGiorno', 'someurl.com/burgers', 'burgers');
insert into blogs (url, title, likes) values ('someurl.com/blogpoint', 'spam as a culinary invention', 3);
