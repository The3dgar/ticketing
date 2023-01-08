import { useState } from 'react';
import { useRequest } from '../../hooks/useRequest';
import Router from 'next/router';

const NewTicket = () => {
  const [title, setTitle] = useState();
  const [price, setPrice] = useState();

  const onBlur = () => {
    const value = parseFloat(price);
    if (isNaN(value)) {
      return;
    }

    setPrice(value.toFixed(2));
  };

  const { doRequest, errors } = useRequest({
    url: '/api/tickets',
    method: 'post',
    body: {
      title,
      price,
    },
    onSuccess: () => {
      Router.push('/');
    },
  });

  const onSubmit = (e) => {
    e.preventDefault();

    doRequest();
  };
  return (
    <div>
      <h1>Create a ticket</h1>
      <form onSubmit={onSubmit}>
        <div className='form-group'>
          <label htmlFor=''>Title</label>
          <input
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            className='form-control'
            type='text'
          />
        </div>
        <div className='form-group'>
          <label htmlFor=''>price</label>
          <input
            className='form-control'
            type='text'
            onChange={(e) => setPrice(e.target.value)}
            value={price}
            onBlur={onBlur}
          />
        </div>
        {errors}
        <button className='btn btn-primary'>Submit</button>
      </form>
    </div>
  );
};

export default NewTicket;
