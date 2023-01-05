import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import { urlCurrentUser } from '../utils/urls';
import Header from '../components/Header';

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <Component {...pageProps} />
    </div>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const { data } = await buildClient(ctx).get(urlCurrentUser);
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  return {
    pageProps,
    ...data,
  };
};

export default MyApp;
