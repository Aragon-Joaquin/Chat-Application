process.loadEnvFile();

const { DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, IS_PRODUCTION } =
  process.env;

export const EnvDBInfo = {
  DB_PORT: Number(DB_PORT) ?? 3306,
  DB_USERNAME: DB_USERNAME ?? 'root',
  DB_PASSWORD: DB_PASSWORD ?? 'admin',
  DB_NAME: DB_NAME ?? 'database_name',
  IS_PRODUCTION: !(Boolean(IS_PRODUCTION) ?? false),
};

const { HASH_LENGTH, HASH_SECRET } = process.env;

export const hashingInformation = () => {
  if (!HASH_LENGTH || !HASH_SECRET)
    throw new Error(
      "Didn't specify the HASH_LENGTH or HASH_SECRET in the .env file. Please, do it or else the passwords won't be hashed and easily hacked.",
    );
  return {
    HASH_LENGTH: Number(HASH_LENGTH),
    HASH_SECRET: HASH_SECRET,
  };
};

const { JWT_SECRET } = process.env;

export const getJWTSecret = () => {
  if (JWT_SECRET == undefined)
    throw new Error(
      "Specify the JWT SECRET in the .env file. Vulnerability would be high if don't.",
    );

  return {
    JWT_SECRET,
  };
};
