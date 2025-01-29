/*
    THIS IS POSTGRESQL.
    ANY HELP WITH THE SQL FILE IS APPRECIATED AND I WILL GIVE YOU CREDIT FOR IT.


	things to remember: 
	- passwords will be hashed
	- passwords lengths will be controlled in the server before hashing
	- insert into ON CONFLICT in Room table "roomID"
*/

CREATE TABLE FileStorager (
	fileID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	fileSRC varchar NOT NULL,
	fileName varchar NOT NULL
)

CREATE TABLE User (
	userID SERIAL primary key, --this could be a UUID type
	userName varchar(20) UNIQUE NOT NULL,
	userPassword text NOT NULL,
	profilePicture UUID,
	
	CONSTRAINT fk_profilePicture FOREIGN KEY (profilePicture) REFERENCES FileStorager(fileID),
)

/* 
TESTING. PROBABLY I'LL HANDLE THIS IN THE SERVER INSTEAD OF THE DB

-- CREATE SEQUENCE ROOMID_ONERROR;
-- ...ON CONFLICT (roomID) DO UPDATE lpad(nextval('ROOMID_ONERROR'), 6, '0')

INSERT INTO Room (roomID)
VALUES (substr(md5(random()::text), 1, 6))
ON CONFLICT (roomID) DO UPDATE
    SET roomID = lpad(nextval('ROOMID_ONERROR'), 6, '0'); 
	
*/

CREATE TABLE Room (
	roomID char(6) PRIMARY KEY UNIQUE DEFAULT substr(md5(random()::text), 1, 6), -- generate a random code that consists of 6 characters
	roomName varchar(20) UNIQUE NOT NULL,
	roomPassword text NOT NULL,
	roomDescription varchar(100) NULL,
	createdAt date NOT NULL DEFAULT TO_CHAR(CURRENT_DATE, 'mm/dd/yyyy'),
	roomPicture UUID,
	isAvailable boolean DEFAULT true NOT NULL,

	CONSTRAINT fk_roomPicture FOREIGN KEY (roomPicture) REFERENCES FileStorager(fileID)
)

CREATE TABLE Roles (
	roleName varchar(20) not null primary key UNIQUE,
	deleteMessages boolean DEFAULT false NOT NULL,
	removeUsers boolean DEFAULT false NOT NULL,
	canBeRemoved boolean DEFAULT true NOT NULL
)

INSERT into Roles(roleName) values("user")
INSERT into Roles(roleName, deleteMessages, removeUsers) values("admin", true, true)
INSERT into Roles values("owner", true, true, false)

CREATE TABLE Message(
	messageID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	messageContent text null, -- you can send images without text
	dateSended timestamp not null default CURRENT_TIMESTAMP(0),
	fileID UUID null,

	CONSTRAINT fk_fileID FOREIGN KEY (fileID) REFERENCES FileStorager(fileID)
)