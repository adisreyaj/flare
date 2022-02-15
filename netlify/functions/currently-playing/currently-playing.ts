import { Handler } from '@netlify/functions';
import { auth, get } from '@upstash/redis';

export const handler: Handler = async (event, context) => {
  const { name = 'stranger' } = event.queryStringParameters;
  const { REDIS_URL, REDIS_READ_TOKEN } = process.env;
  auth(REDIS_URL, REDIS_READ_TOKEN);

  const errorResponse = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, ${name}!`,
    }),
  };
  try {
    const { data, error } = await get('count');
    if (error) return errorResponse;
    return {
      statusCode: 200,
      body: JSON.stringify(data),
    };
  } catch (error) {
    return errorResponse;
  }
};
