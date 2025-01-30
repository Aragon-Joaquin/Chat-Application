/*
    THIS IS POSTGRESQL.
    ANY HELP WITH THE SQL FILE IS APPRECIATED AND I WILL GIVE YOU CREDIT FOR IT.


	things to remember: 
	- passwords will be hashed
	- passwords lengths will be controlled in the server before hashing
	- insert into ON CONFLICT in Room table "roomID"
*/

-- RELATIONSHIPS ONE TO MANY & ONE TO ONE

CREATE TABLE FileStorager (
	fileID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	fileSRC text NOT NULL, -- i have no idea how long the url is gonna be
	fileName varchar(30) NOT NULL
);

CREATE TABLE "User" (
	userID SERIAL PRIMARY KEY, --this could be a UUID type
	userName varchar(20) UNIQUE NOT NULL,
	userPassword text NOT NULL,
	profilePicture UUID, --MAKE A DEFAULT PROFILE PICTURE
	
	CONSTRAINT fk_profilePicture FOREIGN KEY (profilePicture) REFERENCES FileStorager(fileID)
);

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
	roomName varchar(20) NOT NULL,
	roomPassword text NULL,
	roomDescription varchar(150) NULL,
	createdAt date NOT NULL DEFAULT CURRENT_DATE,
	roomPicture UUID,
	-- isEmpty boolean DEFAULT false NOT NULL,

	CONSTRAINT fk_roomPicture FOREIGN KEY (roomPicture) REFERENCES FileStorager(fileID)
);


CREATE TABLE Roles (
	roleName varchar(20) NOT NULL PRIMARY KEY UNIQUE,
	deleteMessages boolean DEFAULT false NOT NULL,
	removeUsers boolean DEFAULT false NOT NULL,
	canBeRemoved boolean DEFAULT true NOT NULL
);

INSERT into Roles(roleName)values('user');
INSERT into Roles(roleName, deleteMessages, removeUsers) values('admin', true, true);
INSERT into Roles values('owner', true, true, false);

CREATE TABLE "Message"(
	messageID UUID PRIMARY KEY DEFAULT gen_random_uuid(),
	messageContent text null, -- you can send images without text
	dateSended timestamp not null default CURRENT_TIMESTAMP(0),
	fileID UUID null,

	CONSTRAINT fk_fileID FOREIGN KEY (fileID) REFERENCES FileStorager(fileID)
);

-- RELATIONSHIPS MANY TO MANY

CREATE TABLE Users_In_Room (
	userID SERIAL NOT NULL,
	roomID char(6) NOT NULL,
	roleID varchar(20) NOT NULL,

	PRIMARY KEY (userID, roomID),

	CONSTRAINT fk_userID FOREIGN KEY (userID) REFERENCES "User"(userID),
	CONSTRAINT fk_roomID FOREIGN KEY (roomID) REFERENCES Room(roomID),
	CONSTRAINT fk_roleID FOREIGN KEY (roleID) REFERENCES Roles(roleName)
);

CREATE TABLE Room_Messages (
	senderID SERIAL NOT NULL,
	whichRoom char(6) NOT NULL,
	messageID UUID NOT NULL,

	PRIMARY KEY (senderID, whichRoom, messageID),
	
	CONSTRAINT fk_senderID FOREIGN KEY (senderID) REFERENCES "User"(userID),
	CONSTRAINT fk_whichRoom FOREIGN KEY (whichRoom) REFERENCES Room(roomID),
	CONSTRAINT fk_messageID FOREIGN KEY (messageID) REFERENCES "Message"(messageID)
);