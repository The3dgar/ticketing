import axios from 'axios';
import { urlIngressService } from '../utils/urls';

export default ({ req }) => {
  if (typeof window === 'undefined') {
    return axios.create({
      baseURL: urlIngressService,
      headers: req.headers,
    });
  } else {
    // browser
    return axios.create({
      baseURL: '/',
    });
  }
};
