/*
    THIS IS POSTGRESQL.
    ANY HELP WITH THE SQL FILE IS APPRECIATED AND I WILL GIVE YOU CREDIT FOR IT.
*/

CREATE TABLE FileStorager (
	fileID UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
	fileSRC varchar NOT NULL,
	fileName varchar NOT NULL
)

CREATE TABLE User (
	userID SERIAL primary key, --this could be a UUID type
	userName varchar(20) UNIQUE NOT NULL,
	password text NOT NULL,
	profilePicture SERIAL,
	

	CONSTRAINT fk_profilePicture FOREIGN KEY (profilePicture) REFERENCES FileStorager(fileID),
	ADD CONSTRAINT ck_userName CHECK (char_length(name) < 20)
)