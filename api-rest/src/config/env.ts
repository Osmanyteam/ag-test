import * as dotenv from 'dotenv';
if (process.env['NODE_ENV'] === 'test') {
  dotenv.config({ path: '.env.test' });
} else {
  dotenv.config({ path: '.env.dev' });
}


const keys = {
  env: process.env['NODE_ENV'],
  port: process.env['PORT'],
  mysql_url: process.env['DATABASE_URL']
};

interface Keys {
  env: 'development' | 'staging' | 'production';
  port: number;
  mysql_url: string,
}

const getSanitizedConfig = (config: typeof keys): Keys => {
  for (const [key, value] of Object.entries(config)) {
    if (value === undefined) {
      throw new Error(`Missing key ${key} in config.env`);
    }
  }
  return config as unknown as Keys;
};

export default getSanitizedConfig(keys);
