export type User = {
  email: string;
  exp: number;
  iat: number;
  name: string;
  picture: string;
  sub: string;
};

export type Options = {
  hostname: string;
  tvPlayerUrl: string;
  tvPlayerType: 'embed' | 'sportbox' | 'matchtv' | 'more.tv' | 'vitrina.tv';
  tvPlayerIsPlaylist: boolean;
  twitchPlayer: string;
  twitchChats: string[];
};

export type GetOptionsResponse = {
  role: Role;
  options: Options;
};

export type UpdateOptionsDto = Partial<
  Pick<Options, 'tvPlayerUrl' | 'twitchPlayer' | 'twitchChats'>
>;

export type OptionNames = keyof Options;

export type Role = 'admin' | 'moderator';

export type OptionsRow = { name: string; value: string };

export type RolesRow = { userId: string; role: Role };
