/*
    THIS IS POSTGRESQL.
    ANY HELP WITH THE SQL FILE IS APPRECIATED AND I WILL GIVE YOU CREDIT FOR IT.
*/

-- RELATIONSHIPS ONE TO MANY & ONE TO ONE

CREATE TABLE file_storage (
	file_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	file_src text NOT NULL, -- i have no idea how long the url is gonna be
	file_name varchar(30) NOT NULL
);

CREATE TABLE users (
	user_id SERIAL PRIMARY KEY, --this could be a UUID type
	user_name varchar(20) UNIQUE NOT NULL,
	user_password text NOT NULL,
	profile_picture UUID, --MAKE A DEFAULT PROFILE PICTURE
	
	CONSTRAINT fk_profile_picture FOREIGN KEY (profile_picture) REFERENCES file_storage(file_id)
);


CREATE SEQUENCE ROOMID_ONERROR;

CREATE TABLE room (
	room_id char(6) PRIMARY KEY UNIQUE DEFAULT substr(md5(random()::text), 1, 6), -- generate a random code that consists of 6 characters
	room_name varchar(20) NOT NULL,
	room_password text NULL,
	room_description varchar(150) NULL,
	created_at date NOT NULL DEFAULT CURRENT_DATE,
	room_picture UUID,
	-- isEmpty boolean DEFAULT false NOT NULL,

	CONSTRAINT fk_room_picture FOREIGN KEY (room_picture) REFERENCES file_storage(file_id)
);


CREATE TABLE roles (
	role_name varchar(20) NOT NULL PRIMARY KEY UNIQUE,
	delete_messages boolean DEFAULT false NOT NULL,
	remove_users boolean DEFAULT false NOT NULL,
	can_be_removed boolean DEFAULT true NOT NULL
);

INSERT into roles(role_name)values('user');
INSERT into roles(role_name, delete_messages, remove_users) values('admin', true, true);
INSERT into roles values('owner', true, true, false);

CREATE TABLE messages(
	message_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	message_content text null, -- you can send images without text
	file_id UUID null,

	CONSTRAINT fk_file_id FOREIGN KEY (file_id) REFERENCES file_storage(file_id)
);

-- RELATIONSHIPS MANY TO MANY

CREATE TABLE users_in_room (
	user_id SERIAL NOT NULL,
	room_id char(6) NOT NULL,
	role_id varchar(20) NOT NULL,

	PRIMARY KEY (user_id, room_id),

	CONSTRAINT fk_user_id FOREIGN KEY (user_id) REFERENCES users(user_id),
	CONSTRAINT fk_room_id FOREIGN KEY (room_id) REFERENCES room(room_id),
	CONSTRAINT fk_role_id FOREIGN KEY (role_id) REFERENCES roles(role_name)
);

CREATE TABLE room_messages (
	sender_id SERIAL NOT NULL,
	which_room char(6) NOT NULL,
	message_id UUID NOT NULL,
	date_sended timestamp not null default CURRENT_TIMESTAMP(0),

	PRIMARY KEY (sender_id, which_room, message_id),
	
	CONSTRAINT fk_sender_id FOREIGN KEY (sender_id) REFERENCES users(user_id),
	CONSTRAINT fk_which_room FOREIGN KEY (which_room) REFERENCES room(room_id),
	CONSTRAINT fk_message_id FOREIGN KEY (message_id) REFERENCES messages(message_id)
);