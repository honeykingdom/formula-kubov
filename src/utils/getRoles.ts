import type { RolesRow } from 'types';
import parseRoles from './parseRoles';
import supabase from './supabase';

const getRoles = async () => {
  const response = await supabase.from<RolesRow>('fk_roles').select('*');

  return parseRoles(response);
};

export default getRoles;
