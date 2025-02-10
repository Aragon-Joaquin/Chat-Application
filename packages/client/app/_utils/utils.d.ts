//! d.ts === files are declaration files that contain only type information.

export const URL_DATABASE = 'http://localhost:3000' as const
export type URL_ENDPOINTS = { login: '/' } | { room: '/' | '/roomhistory' }
