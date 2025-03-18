import * as argon2 from 'argon2';
import { hashingInformation } from './getEnvVariables';

const { HASH_LENGTH, HASH_SECRET } = hashingInformation();

export const hashPassword = async (string: string) => {
  return await argon2.hash(string, {
    hashLength: HASH_LENGTH,
    secret: Buffer.from(HASH_SECRET),
  });
};

/***
 * @returns TRUE if it's the same
 */
export const comparePassword = async ({
  userPassword = '',
  originalPassword = '',
}: {
  userPassword: string;
  originalPassword: string;
}) => {
  if (userPassword == '' || originalPassword == '') return false;
  return await argon2.verify(originalPassword, userPassword, {
    secret: Buffer.from(HASH_SECRET),
  });
};
