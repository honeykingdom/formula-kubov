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
import { signIn, signOut, useSession } from 'next-auth/client';
import { GetOptionsResponse, Options, Role, UpdateOptionsDto } from 'types';

const STREAMERS = [
  { name: 'Melharucos', channel: 'melharucos' },
  { name: 'HoneyMad', channel: 'honeymad' },
  { name: 'Lasqa', channel: 'lasqa' },
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
              <ButtonGroup size="sm" mb={2} isAttached variant="outline">
                <Button
                  onClick={() => setTvPlayerInput('https://matchtv.ru/on-air')}
                >
                  МатчТВ
                </Button>
                <Button
                  onClick={() =>
                    setTvPlayerInput('https://static-hbb.1tv.ru/media/stream')
                  }
                >
                  Первый канал
                </Button>
                <Button
                  onClick={() =>
                    setTvPlayerInput('https://vitrina.tv/#russia1')
                  }
                >
                  Россия 1
                </Button>
              </ButtonGroup>
              <Flex>
                <Input
                  mr={2}
                  value={tvPlayerInput}
                  onChange={(e) => setTvPlayerInput(e.target.value)}
                />
                <Button onClick={onTvPlayerClick}>Сохранить</Button>
              </Flex>
              <FormHelperText>
                Ссылка на sportbox, matchtv, more.tv, vitrina.tv или youtube
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

const AdminPage = () => (
  <ChakraProvider>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <Admin />
  </ChakraProvider>
);

export default AdminPage;
