"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.COOKIE_EXPIRATION = exports.MAXIMUM_ROOMS_PER_USER = exports.ROLES = exports.WS_ENDPOINTS_EVENTS = exports.WS_ACTIONS = exports.WS_NAMESPACE = exports.WS_PORT = void 0;
exports.WS_PORT = 8080;
exports.WS_NAMESPACE = 'roomChats';
exports.WS_ACTIONS = {
    LEAVE: 'leaveRoom',
    JOIN: 'joinRoom',
    JOIN_MULTIPLE: 'joinRooms',
    SEND: 'sendMessage',
    DELETE: 'deleteMessage'
};
exports.WS_ENDPOINTS_EVENTS = {
    MESSAGE: 'sendMessage',
    JOINED_ROOM: 'joinedRoom',
    LEAVED_ROOM: 'leavedRoom',
    DELETE_MESSAGE: 'deleteMessage'
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
