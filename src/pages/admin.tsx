// TODO: https://github.com/nextauthjs/next-auth/issues/988#issuecomment-830623141
import 'core-js';
import 'regenerator-runtime/runtime';
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
  Flex,
  useToast,
  extendTheme,
  ColorModeScript,
} from '@chakra-ui/react';
import { Provider as AuthProvider } from 'next-auth/client';
import { signIn, signOut, useSession } from 'next-auth/client';
import { GetOptionsResponse, Options, Role, UpdateOptionsDto } from 'types';

const STREAMERS = [
  { name: 'Melharucos', channel: 'melharucos' },
  { name: 'HoneyMad', channel: 'honeymad' },
  { name: 'Lasqa', channel: 'lasqa' },
] as const;

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
    url: 'https://player.vgtrk.com/iframe/live/id/2961',
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

const Admin = () => {
  const toast = useToast();

  const [session, loading] = useSession();
  const [options, setOptions] = useState<Options>();
  const [role, setRole] = useState<Role>();

  const [tvPlayerInput, setTvPlayerInput] = useState('');
  const [twitchChatsInput, setTwitchChatsInput] = useState('');

  useEffect(() => {
    (async () => {
      const { options, role } = await getOptions();

      setOptions(options);
      setRole(role);

      setTvPlayerInput(options.tvPlayerUrl);
      setTwitchChatsInput(options.twitchChats.join(';'));
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
    const twitchChats = twitchChatsInput.split(';').map((s) => s.trim());
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
        <Box as="p" mb={4} textAlign="center">
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
          <Box as="p" mb={4}>
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

          <Box as="p" mb={4}>
            <FormControl>
              <FormLabel>Twitch чаты</FormLabel>
              <Flex>
                <Input
                  mr={2}
                  value={twitchChatsInput}
                  onChange={(e) => setTwitchChatsInput(e.target.value)}
                />
                <Button onClick={onTwitchChatsClick}>Сохранить</Button>
              </Flex>
              <FormHelperText>
                Разделять через точку с запятой ";"
              </FormHelperText>
            </FormControl>
          </Box>

          <Box as="p" mb={4}>
            <FormControl>
              <FormLabel>TV плеер</FormLabel>
              <Box mb={2}>
                {PLAYERS.map(({ title, url }) => (
                  <Button
                    key={title}
                    variant="outline"
                    size="sm"
                    onClick={() => setTvPlayerInput(url)}
                  >
                    {title}
                  </Button>
                ))}
              </Box>
              <Flex>
                <Input
                  mr={2}
                  value={tvPlayerInput}
                  onChange={(e) => setTvPlayerInput(e.target.value)}
                />
                <Button onClick={onTvPlayerClick}>Сохранить</Button>
              </Flex>
              <FormHelperText>
                Ссылка на sportbox, matchtv, more.tv, vitrina.tv, smotrim.ru или
                youtube
              </FormHelperText>
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

const AdminPage = ({ session }) => (
  <AuthProvider
    session={session}
    options={{ keepAlive: Infinity, clientMaxAge: Infinity }}
  >
    <ChakraProvider>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <Admin />
    </ChakraProvider>
  </AuthProvider>
);

export default AdminPage;
