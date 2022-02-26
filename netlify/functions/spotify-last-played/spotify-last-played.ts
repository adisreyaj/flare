import { auth, get, set } from '@upstash/redis';
import { createDecipheriv, createHash } from 'crypto';
import { request } from 'undici';

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=5`;

function decrypt(text) {
  try {
    let [iv, data] = text.split('|||');
    let ivHex = Buffer.from(iv, 'hex');
    let encryptedText = Buffer.from(data, 'hex');
    const key = Buffer.from(
      createHash('sha256')
        .update(String(process.env.ENCRYPTION_SECRET))
        .digest('base64')
        .substr(0, 32)
    );
    let decipher = createDecipheriv('aes-256-cbc', key, ivHex);
    let decrypted = decipher.update(encryptedText);

    decrypted = Buffer.concat([decrypted, decipher.final()]);

    return decrypted.toString();
  } catch (error) {
    return null;
  }
}
const getAccessToken = async (refreshToken) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');
  const { statusCode, body } = await request(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    }).toString(),
  });
  return body.json();
};

const getNowPlayingSongFromSpotify = async (accessToken) => {
  return request(NOW_PLAYING_ENDPOINT, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

const getSongResponseDataWithRefreshToken = async (username) => {
  const { data } = await get(username);
  if (data !== null || data === '') {
    const refreshToken = decrypt(data);
    const { access_token: accessToken } = await getAccessToken(refreshToken);
    return getSongDataFromSpotify(accessToken);
  }
  return null;
};

const getSongDataFromSpotify = async (
  accessToken: string
): Promise<
  { title: string; artist: string; albumName: string; image: string }[]
> => {
  const { body } = await getNowPlayingSongFromSpotify(accessToken);
  const result = await body.json();
  const { items } = result;

  return (items ?? []).map((item) => {
    const {
      track: { name, album, artists },
    } = item;
    const title = name;
    const artist = artists.map((_artist) => _artist.name).join(', ');
    const albumName = album.name;
    const image = album.images[0].url;

    return { title, artist, album: albumName, image };
  });
};

const errorResponse = {
  statusCode: 500,
  body: JSON.stringify({
    error: 'Something went wrong',
  }),
};

exports.handler = async (event) => {
  const { REDIS_URL, REDIS_WRITE_TOKEN } = process.env;
  const username = event.path.split('/@')[1];
  if (!username) {
    return errorResponse;
  }

  let songInfo = null;
  auth(REDIS_URL, REDIS_WRITE_TOKEN);
  const { data } = await get(`${username}###last`);
  if (data != null && data !== '') {
    return {
      statusCode: 200,
      headers: {
        'Cache-Control': 'max-age=3600',
        'Content-Type': 'application/json',
      },
      body: data,
    };
  }
  try {
    songInfo = await getSongResponseDataWithRefreshToken(username);
    if (songInfo != null) {
      await set(`${username}###last`, JSON.stringify(songInfo));
      return {
        statusCode: 200,
        headers: {
          'Cache-Control': 'max-age=3600',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(songInfo),
      };
    }
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Not configured',
      }),
    };
  } catch (e) {
    return errorResponse;
  }
};
