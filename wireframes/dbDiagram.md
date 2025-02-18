## I USED [dbdiagram.io](https://dbdiagram.io/d) TO DRAW THIS DIAGRAM

### UPDATE: this was a prototype. The .sql in the wireframe folder is what im currently using and its updated if i found some inconsistency.

```sql
Table Roles {
  // user - admin - owner
  roleName varchar [primary key]
  deleteMessages boolean [default: false]
  removeUsers boolean [default: false]
  canBeRemoved boolean [default: true]
}

Table User {
  userID integer [primary key, increment]
  userName varchar [not null, unique]
  password varchar [not null, note: "Encripted"]

  profilePicture integer [null, ref: - FileStorager.fileID]
}

table FileStorager {
  fileID integer [primary key, increment]
  //fileExtension, this will be handeled by the server since only manages images
  fileSRC varchar [not null]
  fileName varchar [not null]
}

Table Room {
  roomID varchar [primary key, unique, not null ,note: "this will be a code"]
  roomName varchar [not null]
  roomPassword varchar [null, note: "Encripted"]
  roomDescription varchar [null]
  createdAt date

  roomPicture integer [null, ref: - FileStorager.fileID]
}

Table Message {
  messageID integer [primary key, increment]
  messageContent varchar [not null]
  dateSended date [not null]
  messageStatus messageStatus [not null]

  fileID integer [null, ref: - FileStorager.fileID]
}

Enum messageStatus {
  Sended
  Delivered
  Readed
}

// many to many tables

Table Users_In_Room {
  userID integer [primary key, ref: > User.userID]
  roomID varchar [primary key, ref: > Room.roomID]
  roleID varchar [ref: > Roles.roleName]
}

Table Room_Messages {
  senderID integer [primary key, ref: > User.userID]
  whichRoomID varchar [primary key, ref: > Room.roomID]
  messageID varchar [primary key, ref: - Message.messageID]
}
```
