import { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/useRequest';
import { urlSignup } from '../../utils/urls';

const signup = () => {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('123456');
  const { doRequest, errors } = useRequest({
    url: urlSignup,
    method: 'post',
    body: {
      email,
      password,
    },
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await doRequest();
      Router.push('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form onSubmit={onSubmit}>
      <h1>Sign Up</h1>
      <div className='form-group'>
        <label>Email Address!</label>
        <input
          type='text'
          className='form-control'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className='form-group'>
        <label>Password</label>
        <input
          type='password'
          className='form-control'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button className='btn btn-primary'>Sign up</button>
      {errors}
    </form>
  );
};

export default signup;
