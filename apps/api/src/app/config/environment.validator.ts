import * as Joi from 'joi';

export const ENVIRONMENT_VALIDATION_SCHEMA = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'provision')
    .default('development'),
  PORT: Joi.number().default(3333),
  DATABASE_URL: Joi.string()
    .uri({ scheme: ['mysql'] })
    .required(),
  FRONT_END_CALLBACK_URL: Joi.string()
    .uri({ scheme: ['https', 'http'] })
    .required(),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRY: Joi.string().required(),
  COOKIE_SECRET: Joi.string().required(),
  GOOGLE_CLIENT_ID: Joi.string(),
  GOOGLE_CLIENT_SECRET: Joi.string(),
  GOOGLE_CALLBACK_URI: Joi.string().uri({ scheme: ['https', 'http'] }),
  REDIS_HOST: Joi.string().required(),
  REDIS_PORT: Joi.string().required(),
  REDIS_PASSWORD: Joi.string().allow(''),
  S3_ENDPOINT: Joi.string()
    .required()
    .uri({ scheme: ['https'] }),
  S3_REGION: Joi.string().required(),
  S3_BUCKET: Joi.string().required(),
  S3_ACCESS_KEY_ID: Joi.string(),
  S3_SECRET_ACCESS_KEY: Joi.string(),
});
