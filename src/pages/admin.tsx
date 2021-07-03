// TODO: remove nodemailer dependency`
import { useEffect, useState } from 'react';
import {
  ChakraProvider,
  Box,
  Button,
  ButtonGroup,
  FormLabel,
  Input,
  Heading,
  FormControl,
  FormHelperText,
  useToast,
  extendTheme,
  ColorModeScript,
} from '@chakra-ui/react';
import Select from 'react-select';
import type { ThemeConfig } from 'react-select/src/theme';
import { Session } from 'next-auth';
import { SessionProvider, signIn, signOut, useSession } from 'next-auth/react';
import type {
  GetOptionsResponse,
  Options,
  Role,
  UpdateOptionsDto,
} from 'types';

const STREAMERS = [
  { name: 'Melharucos', channel: 'melharucos' },
  { name: 'HoneyMad', channel: 'honeymad' },
  { name: 'Lasqa', channel: 'lasqa' },
  { name: 'Segall', channel: 'segall' },
] as const;

const CHATS = STREAMERS.map(({ channel }) => ({
  label: channel,
  value: channel,
}));

const PLAYERS = [
  {
    title: 'МатчТВ',
    url: 'https://matchtv.ru/on-air',
  },
  {
    title: 'Первый канал',
    url: 'https://static.1tv.ru/eump/embeds/public_sport.html?channel_id=1&channels_api_url=https://api.1tv.ru/v2/special/channels.json',
  },
  {
    title: 'Россия 1 (vgtrk.com)',
    url: 'https://player.vgtrk.com/iframe/live/id/2961',
  },
  {
    title: 'Россия 1 (vitrina.tv)',
    url: 'https://vitrina.tv/#russia1',
  },
  {
    title: 'Россия 1 (smotrim.ru)',
    url: 'https://smotrim.ru/live/channel/2961',
  },
  {
    title: 'Россия 1 (more.tv)',
    url: 'https://more.tv/online/russia1_hd',
  },
] as const;

// https://github.com/JedWatson/react-select/issues/3692#issuecomment-523425096
const SELECT_THEME: ThemeConfig = (theme) => ({
  ...theme,
  colors: {
    ...theme.colors,
    danger: 'var(--chakra-colors-red-400)',
    dangerLight: 'var(--chakra-colors-red-100)',
    neutral0: 'var(--chakra-colors-gray-800)',
    neutral10: 'var(--chakra-colors-whiteAlpha-400)',
    neutral20: 'var(--chakra-colors-whiteAlpha-300)',
    neutral30: 'var(--chakra-colors-whiteAlpha-400)',
    neutral80: 'var(--chakra-colors-whiteAlpha-900)',
    primary25: 'var(--chakra-colors-whiteAlpha-300)',
    primary50: 'var(--chakra-colors-whiteAlpha-400)',
  },
});

const getOptions = async () => {
  const response = await fetch('/api/options');
  const json = await response.json();

  return json as GetOptionsResponse;
};

const updateOptions = async (newOptions: UpdateOptionsDto) => {
  const response = await fetch('/api/options', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newOptions),
  });

  return response.status === 200;
};

type SelectOption = { label: string; value: string };

const Admin = () => {
  const toast = useToast();

  const [session, loading] = useSession();
  const [options, setOptions] = useState<Options>();
  const [role, setRole] = useState<Role>();

  const [tvPlayerInput, setTvPlayerInput] = useState('');
  const [twitchChatsInput, setTwitchChatsInput] = useState<SelectOption[]>([]);

  useEffect(() => {
    (async () => {
      const data = await getOptions();

      setOptions(data.options);
      setRole(data.role);

      setTvPlayerInput(data.options.tvPlayerUrl);
      setTwitchChatsInput(
        data.options.twitchChats.map((chat) => ({ label: chat, value: chat })),
      );
    })();
  }, []);

  if (loading) return null;

  const isFormVisible = session && (role === 'admin' || role === 'moderator');

  const onTwitchPlayerClick = (twitchPlayer: string) => async () => {
    setOptions((prev) => ({ ...prev, twitchPlayer }));

    const isUpdated = await updateOptions({ twitchPlayer });

    toast({
      title: isUpdated
        ? 'Twitch плеер обновлён'
        : 'Не удалось обновить Twitch плеер',
      description: isUpdated ? twitchPlayer : null,
      status: isUpdated ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const onTwitchChatsClick = async () => {
    const twitchChats = twitchChatsInput.map((chat) => chat.value);
    const isUpdated = await updateOptions({ twitchChats });

    toast({
      title: isUpdated
        ? 'Twitch чаты обновлены'
        : 'Не удалось обновить Twitch чаты',
      description: isUpdated ? twitchChats.join(', ') : null,
      status: isUpdated ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const onTvPlayerClick = async () => {
    const isUpdated = await updateOptions({ tvPlayerUrl: tvPlayerInput });

    toast({
      title: isUpdated ? 'TV плеер обновлён' : 'Не удалось обновить TV плеер',
      description: isUpdated ? tvPlayerInput : null,
      status: isUpdated ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <Box w={480} p={4} m="20px auto">
      <Heading as="h1" mb={4} size="xl" textAlign="center">
        Формула Кубов
      </Heading>

      {session && (
        <Box as="p" mb={4} textAlign="center">
          {session.user.name} <Button onClick={() => signOut()}>Выйти</Button>
        </Box>
      )}

      {!session && (
        <Box mb={4} textAlign="center">
          <Button onClick={() => signIn('twitch')}>Войти</Button>
        </Box>
      )}

      {isFormVisible && (
        <Box
          p={4}
          borderWidth="1px"
          rounded="lg"
          shadow="1px 1px 3px rgba(0,0,0,0.3)"
        >
          <Box mb={4}>
            <FormControl>
              <FormLabel>Twitch плеер</FormLabel>
              <ButtonGroup size="sm" isAttached variant="outline">
                {STREAMERS.map(({ name, channel }) => (
                  <Button
                    key={name}
                    isActive={options.twitchPlayer === channel}
                    onClick={onTwitchPlayerClick(channel)}
                  >
                    {name}
                  </Button>
                ))}
                <Button
                  isActive={options.twitchPlayer === ''}
                  onClick={onTwitchPlayerClick('')}
                >
                  Выкл
                </Button>
              </ButtonGroup>
            </FormControl>
          </Box>

          <Box mb={4}>
            <FormControl>
              <FormLabel>Twitch чаты</FormLabel>
              <Box mb={2}>
                <Select
                  value={twitchChatsInput}
                  options={CHATS}
                  theme={SELECT_THEME}
                  isMulti
                  onChange={(chats) =>
                    setTwitchChatsInput(chats as unknown as SelectOption[])
                  }
                />
              </Box>
              <Button size="sm" onClick={onTwitchChatsClick}>
                Сохранить
              </Button>
            </FormControl>
          </Box>

          <Box mb={4}>
            <FormControl>
              <FormLabel>TV плеер</FormLabel>
              <Box mb={2}>
                {PLAYERS.map(({ title, url }) => (
                  <Button
                    key={title}
                    variant="outline"
                    size="sm"
                    isActive={tvPlayerInput === url}
                    onClick={() => setTvPlayerInput(url)}
                  >
                    {title}
                  </Button>
                ))}
              </Box>
              <Input
                value={tvPlayerInput}
                onChange={(e) => setTvPlayerInput(e.target.value)}
              />
              <FormHelperText mb={2}>
                Ссылка на sportbox, matchtv, more.tv, vitrina.tv, smotrim.ru или
                youtube
              </FormHelperText>
              <Button size="sm" onClick={onTvPlayerClick}>
                Сохранить
              </Button>
            </FormControl>
          </Box>
        </Box>
      )}
    </Box>
  );
};

const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
});

const AdminPage = ({ session }: { session: Session }) => (
  <SessionProvider
    session={session}
    staleTime={Infinity}
    refetchInterval={Infinity}
  >
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Admin />
    </ChakraProvider>
  </SessionProvider>
);

export default AdminPage;
