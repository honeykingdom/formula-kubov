import type { OptionsRow } from 'types';
import parseOptions from './parseOptions';
import supabase from './supabase';

const getOptions = async () => {
  const response = await supabase.from<OptionsRow>('fk_options').select('*');

  return parseOptions(response);
};

export default getOptions;
