import axios from 'axios';
import { useState } from 'react';

export const useRequest = ({ url, method, body }) => {
  const [errors, setErrors] = useState([]);
  const doRequest = async () => {
    try {
      setErrors([]);
      const { data } = await axios[method](url, body);
      return data;
    } catch (error) {
      setErrors(error.response.data.errors);
      throw error;
    }
  };

  return {
    errors,
    doRequest,
  };
};
