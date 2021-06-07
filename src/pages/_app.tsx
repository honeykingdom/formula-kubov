import { Provider as AuthProvider } from 'next-auth/client';

const MyApp = ({ Component, pageProps }) => (
  <AuthProvider session={pageProps.session}>
    <Component {...pageProps} />
  </AuthProvider>
);

export default MyApp;
