import { Provider as AuthProvider } from 'next-auth/client';

const MyApp = ({ Component, pageProps }) => (
  <AuthProvider
    session={pageProps.session}
    options={{ keepAlive: Infinity, clientMaxAge: Infinity }}
  >
    <Component {...pageProps} />
  </AuthProvider>
);

export default MyApp;
