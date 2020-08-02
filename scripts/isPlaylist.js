const https = require('https');

const request = (url) =>
  new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let body = '';
      res.on('data', (data) => (body += data));
      res.on('end', () => resolve(body));
      res.on('error', (err) => reject(err));
    });
  });

// const url = process.env.GATSBY_TV_PLAYER_URL;
// const url =
//   'https://news.sportbox.ru/Vidy_sporta/Avtosport/Formula_1/spbvideo_NI1217303_translation_Gran_pri_Velikobritanii_Svobodnaja_praktika_3';
const url =
  'https://news.sportbox.ru/Vidy_sporta/Avtosport/Formula_1/spbvideo_NI1217306_translation_Gran_pri_Velikobritanii';

const isPlaylist = async (url) => {
  const response = await request(url);

  return response.includes('//uma.media/playlist/');
};

(async () => {
  let res;

  try {
    res = await isPlaylist(url);
  } catch (e) {
    console.log(e);
  }

  console.log(res);
})();

module.exports = isPlaylist;
