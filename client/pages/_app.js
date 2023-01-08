import 'bootstrap/dist/css/bootstrap.css';
import buildClient from '../api/buildClient';
import { urlCurrentUser } from '../utils/urls';
import Header from '../components/Header';

function MyApp({ Component, pageProps, currentUser }) {
  return (
    <div>
      <Header currentUser={currentUser} />
      <div className='container'>
        <Component {...pageProps} currentUser={currentUser} />
      </div>
    </div>
  );
}

MyApp.getInitialProps = async ({ Component, ctx }) => {
  const client = buildClient(ctx);
  const { data } = await client.get(urlCurrentUser);
  let pageProps = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx, client, data.currentUser);
  }

  return {
    pageProps,
    ...data,
  };
};

export default MyApp;
