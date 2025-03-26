export const createDateNow = (): string => {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
  });
};

// the hierarchy is from top to bottom, being top the most role with privileges
export const typesOfRoles = {
  OWNER: 'owner',
  ADMIN: 'admin',
  USER: 'user',
};

export const MAX_MESSAGES_PER_REQ = 30 as const;
