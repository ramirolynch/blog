drop table users, posts, comments;

create table users (
id serial primary key,
	first_name varchar(150),
	last_name varchar(150),
	admin boolean,
	email varchar(200),
	password varchar(200),
);

insert into users(first_name,last_name, admin, email, password) values ('Ramiro', 'Lynch', 'true', 'ramiro@gmail.com', 'ramipass'),('Carmen', 'Vergara', 'true', 'carmen@gmail.com', 'carmenpass'),('Alejandro', 'Gonzalez', 'false', 'alejandro@gmail.com', 'alepass');

create table posts (
	id serial primary key,
	title text not null,
	body text not null,
	post_ts timestamp not null default now(),
	author_id integer references users
);

insert into posts(title, body, author_id) values ('My first post', 'What I great summer day', 1),('My second post', 'Windy day here in Chicago', 2),('My third post', 'Rainy day here in Seattle', 3);

create table comments (
	id serial primary key,
	body text not null,
	comment_ts timestamp not null default now(),
	author_id integer references users,
    post_id integer references posts
);

insert into comments(body, author_id, post_id) values ('My exact same thoughts', 1, 1),('I disagree', 2,1),('Seriously?',3,1);