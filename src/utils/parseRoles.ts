import type { PostgrestResponse } from '@supabase/postgrest-js/src/lib/types';
import type { OptionsRow, RolesRow } from 'types';

const parseRoles = (
  response: PostgrestResponse<RolesRow>,
): Record<string, 'admin' | 'moderator'> =>
  response.data.reduce(
    (acc, { userId, role }) => ({ ...acc, [userId]: role }),
    {},
  );

export default parseRoles;
