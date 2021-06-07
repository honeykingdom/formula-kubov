import { OptionsRow } from 'types';
import supabase from './supabase';

const updateOptions = async (newOptions: OptionsRow[]) =>
  supabase.from('fk_options').upsert(newOptions);

export default updateOptions;
