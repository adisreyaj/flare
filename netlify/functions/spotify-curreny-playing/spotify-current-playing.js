const cookie = require('cookie');
const { request } = require('undici');
const { auth, get } = require('@upstash/redis');

const maxAge = 60 * 60;

const TOKEN_ENDPOINT = `https://accounts.spotify.com/api/token`;
const NOW_PLAYING_ENDPOINT = `https://api.spotify.com/v1/me/player/recently-played?limit=1`;

const getAccessToken = async (refreshToken) => {
  const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
  const basic = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`
  ).toString('base64');
  const { body } = await request(TOKEN_ENDPOINT, {
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
  const { REDIS_URL, REDIS_READ_TOKEN } = process.env;
  auth(REDIS_URL, REDIS_READ_TOKEN);
  try {
    const { error, data: refreshToken } = await get(username);
    if (error) {
      return null;
    }
    const { access_token: accessToken } = await getAccessToken(refreshToken);
    const cookieData = cookie.serialize('spotify-token', accessToken, {
      httpOnly: true,
      maxAge: maxAge,
      path: '/cool-stuffs',
      sameSite: 'strict',
      secure: true,
    });
    return {
      song: getSongDataFromSpotify(accessToken),
      cookie: cookieData,
    };
  } catch (e) {
    return null;
  }
};

const getSongDataFromSpotify = async (accessToken) => {
  try {
    const { body } = await getNowPlayingSongFromSpotify(accessToken);
    const result = await body.json();
    const { items } = result;
    const {
      track: { name, album, artists },
    } = items[0];
    const title = name;
    const artist = artists.map((_artist) => _artist.name).join(', ');
    const albumName = album.name;
    const image = album.images[0].url;

    return { title, artist, album: albumName, image };
  } catch (e) {
    return null;
  }
};

const errorResponse = {
  statusCode: 500,
  body: JSON.stringify({
    error: 'Something went wrong',
  }),
};

exports.handler = async (event) => {
  const username = event.path.split('/@')[1];
  let songInfo = null;
  let cookieData = null;
  const cookies = cookie.parse(event.headers['cookie']);
  const spotifyToken = cookies['spotify-token'];
  try {
    if (spotifyToken) {
      songInfo = await getSongDataFromSpotify(spotifyToken);
    } else {
      const { cookie, song } = await getSongResponseDataWithRefreshToken(
        username
      );
      songInfo = await song;
      cookieData = cookie;
    }
  } catch (e) {
    return errorResponse;
  }

  if (!songInfo) {
    return errorResponse;
  }
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      ...(cookieData ? { 'Set-Cookie': cookieData } : {}),
      'Cache-Control': `public, immutable, no-transform, s-maxage=${maxAge}, max-age=${maxAge}`,
    },
    body: songInfo,
    isBase64Encoded: true,
  };
};
