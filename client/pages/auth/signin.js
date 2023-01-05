import { useState } from 'react';
import Router from 'next/router';
import { useRequest } from '../../hooks/useRequest';
import { urlSignin } from '../../utils/urls';

const signin = () => {
  const [email, setEmail] = useState('test@test.com');
  const [password, setPassword] = useState('123456');
  const { doRequest, errors } = useRequest({
    url: urlSignin,
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
      <h1>Sign In</h1>
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

      <button className='btn btn-primary'>Sign In</button>
      {!!errors.length && (
        <div className='alert alert-danger'>
          <h4>Oopss...</h4>
          <ul className='my-0'>
            {errors.map((e) => (
              <li key={e.message}>{e.message}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};

export default signin;
