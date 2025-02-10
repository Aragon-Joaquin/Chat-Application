export type UUID_TYPE = `${string}-${string}-${string}-${string}-${string}`;
export type ROOM_CODE_TYPE =
  `${string | number}${string | number}${string | number}${string | number}${string | number}${string | number}`;

export interface JWT_DECODED_INFO {
  userName: string;
  id: number;
  iat: number; // issued at       (seconds since Unix epoch)
  exp: number; // expiration time (seconds since Unix epoch)
}

export interface REQUEST_DB_OPTIONS {
  offset?: number;
  limit?: number;
}
