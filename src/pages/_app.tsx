// TODO: https://github.com/nextauthjs/next-auth/issues/988#issuecomment-830623141
import 'core-js';
import 'regenerator-runtime/runtime';
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
