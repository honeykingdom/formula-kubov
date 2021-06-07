import { NextApiRequest, NextApiResponse } from 'next';
import jwt from 'next-auth/jwt';
import fetch from 'node-fetch';
import type {
  GetOptionsResponse,
  OptionsRow,
  UpdateOptionsDto,
  User,
} from 'types';
import getOptions from 'utils/getOptions';
import getRoles from 'utils/getRoles';
import updateOptions from 'utils/updateOptions';

// https://regexr.com/3dj5t
const YOUTUBE_VIDEO_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?(?:youtube\.com|youtu.be)(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/;

const secret = process.env.JWT_SECRET;

const isSportBoxPlaylist = async (url: string) => {
  const response = await fetch(url);
  const text = await response.text();
  const isPlaylist = text.includes('//uma.media/playlist/');

  return isPlaylist;
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const user = (await jwt.getToken({ req, secret })) as User;

  if (!user) {
    res.status(401);

    return res.end();
  }

  const [options, roles] = await Promise.all([getOptions(), getRoles()]);

  if (roles[user.sub] !== 'admin' && roles[user.sub] !== 'moderator') {
    res.status(401);

    return res.end();
  }

  if (req.method === 'GET') {
    const response: GetOptionsResponse = { role: roles[user.sub], options };

    return res.send(response);
  }

  if (req.method === 'PATCH') {
    const {
      tvPlayerUrl,
      twitchPlayer,
      twitchChats,
    }: UpdateOptionsDto = req.body;

    const newOptions: OptionsRow[] = [];

    if (tvPlayerUrl) {
      if (tvPlayerUrl.startsWith('https://news.sportbox.ru')) {
        const isPlaylist = await isSportBoxPlaylist(tvPlayerUrl);

        newOptions.push(
          { name: 'tvPlayerUrl', value: tvPlayerUrl },
          { name: 'tvPlayerType', value: 'sportbox' },
          { name: 'tvPlayerIsPlaylist', value: `${isPlaylist}` },
        );
      } else {
        const m = YOUTUBE_VIDEO_REGEX.exec(tvPlayerUrl);

        if (m) {
          const value = `https://youtube.com/embed/${m[4]}`;

          newOptions.push({ name: 'tvPlayerUrl', value });
        } else {
          newOptions.push({ name: 'tvPlayerUrl', value: tvPlayerUrl });
        }

        newOptions.push({ name: 'tvPlayerType', value: 'embed' });
      }
    }

    if (twitchPlayer) {
      newOptions.push({ name: 'twitchPlayer', value: twitchPlayer });
    }

    if (twitchChats) {
      newOptions.push({ name: 'twitchChats', value: twitchChats.join(';') });
    }

    await updateOptions(newOptions);

    return res.end();
  }
};
