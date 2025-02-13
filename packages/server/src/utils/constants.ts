export const createDateNow = (): string => {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
  });
};

export const WS_PORT = 8080 as const;
export const WS_NAMESPACE = 'roomChats';
export const WS_ACTIONS = {
  LEAVE: 'leaveRoom',
  JOIN: 'joinRoom',
  SEND: 'sendMessage',
  DELETE: 'deleteMessage',
};
export const WS_ENDPOINTS_EVENTS = {
  MESSAGE: 'sendMessage',
  JOINED_ROOM: 'joinedRoom',
  DELETE_MESSAGE: 'deleteMessage',
};

export const ROLES = {
  user: 'user',
  admin: 'admin',
  owner: 'owner',
};
