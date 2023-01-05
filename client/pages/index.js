import buildClient from '../api/buildClient';
import { urlCurrentUser } from '../utils/urls';

function HomePage(props) {
  const { currentUser } = props;
  return currentUser ? (
    <h1>You are signed in</h1>
  ) : (
    <h1>You are NOT signed in</h1>
  );
}

HomePage.getInitialProps = async (context) => {
  const client = buildClient(context);
  const { data } = await client.get(urlCurrentUser);
  return data;
};

export default HomePage;
