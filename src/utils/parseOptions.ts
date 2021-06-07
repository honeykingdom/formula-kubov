import type { PostgrestResponse } from '@supabase/postgrest-js/src/lib/types';
import type { Options, OptionsRow } from 'types';

const parseOptions = (response: PostgrestResponse<OptionsRow>) =>
  response.data.reduce((acc, { name, value }) => {
    let normalizedValue: string | string[] | boolean = value;

    if (name === 'tvPlayerIsPlaylist') normalizedValue = value === 'true';
    if (name === 'twitchChats') normalizedValue = value.split(';');

    if (process.env.NODE_ENV === 'development' && name === 'hostname') {
      normalizedValue = 'localhost';
    }

    return { ...acc, [name]: normalizedValue };
  }, {}) as Options;

export default parseOptions;
