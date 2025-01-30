export const createDateNow = (): string => {
  return new Date().toLocaleDateString('en-CA', {
    timeZone: 'America/New_York',
  });
};
