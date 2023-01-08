import axios from 'axios';
import { useState } from 'react';

export const useRequest = ({ url, method, body, onSuccess }) => {
  const [errors, setErrors] = useState(null);

  const doRequest = async (props = {}) => {
    try {
      setErrors(null);
      const { data } = await axios[method](url, {
        ...body,
        ...props,
      });
      if (onSuccess) {
        onSuccess(data);
      }
      return data;
    } catch (error) {
      const errors = error.response.data.errors;
      setErrors(
        <div className='alert alert-danger mt-2'>
          <h4>Oopss...</h4>
          <ul className='my-0'>
            {errors.map((e) => (
              <li key={e.message}>{e.message}</li>
            ))}
          </ul>
        </div>
      );
      throw error;
    }
  };

  return {
    errors,
    doRequest,
  };
};
