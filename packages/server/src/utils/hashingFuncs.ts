import * as argon2 from 'argon2';
import { hashingInformation } from './getEnvVariables';

export const hashPassword = async (string: string) => {
  const { HASH_LENGTH, HASH_SECRET } = hashingInformation();
  return await argon2.hash(string, {
    hashLength: HASH_LENGTH,
    secret: Buffer.from(HASH_SECRET),
  });
};
