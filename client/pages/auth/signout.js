import React, { useEffect } from 'react';
import { useRequest } from '../../hooks/useRequest';
import { urlSignout } from '../../utils/urls';
import Router from 'next/router';

const signout = () => {
  const { doRequest } = useRequest({
    url: urlSignout,
    method: 'post',
    body: {},
  });

  const handleOut = async () => {
    await doRequest();
    Router.push('/');
  };

  useEffect(() => {
    handleOut();
  }, []);

  return <div>Signing you out...</div>;
};

export default signout;
