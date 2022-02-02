import axios from 'axios';

const api = axios.create({
  baseURL: `${process.env.API_URL}`,
  headers: {
    contentType: 'application/json',
    authorization: `Bearer ${process.env.API_TOKEN}`,
  },
});

export default api;
