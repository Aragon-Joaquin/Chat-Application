"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAX_MESSAGES_PER_REQ = exports.PUBLIC_FOLDER_NAME = exports.COOKIE_EXPIRATION = exports.MAXIMUM_ROOMS_PER_USER = exports.ROLES = exports.WS_ENDPOINTS_EVENTS = exports.WS_ACTIONS = exports.WS_NAMESPACE = exports.WS_PORT = void 0;
exports.WS_PORT = 8080;
exports.WS_NAMESPACE = 'roomChats';
exports.WS_ACTIONS = {
    LEAVE: 'leaveRoom',
    JOIN: 'joinRoom',
    JOIN_MULTIPLE: 'joinRooms',
    SEND: 'sendMessage',
    DELETE: 'deleteMessage',
    CREATE: 'createRoom',
    SEND_MEDIA: 'sendMediaFiles'
};
exports.WS_ENDPOINTS_EVENTS = {
    MESSAGE: 'sendMessage',
    JOINED_ROOM: 'joinedRoom',
    LEAVED_ROOM: 'leavedRoom',
    DELETE_MESSAGE: 'deleteMessage',
    CREATE_ROOM: 'createdRoom',
    ERROR_CHANNEL: 'errorChannel',
    MEDIA_CHANNEL: 'mediaChannel'
};
exports.ROLES = {
    user: 'user',
    admin: 'admin',
    owner: 'owner'
};
exports.MAXIMUM_ROOMS_PER_USER = 5;
exports.COOKIE_EXPIRATION = {
    ANNOTATION_MODE: '12h',
    BY_SECONDS: 43200
};
exports.PUBLIC_FOLDER_NAME = '/assets/';
exports.MAX_MESSAGES_PER_REQ = 30;
