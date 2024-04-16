import axios from 'axios';
import getConfig from 'next/config';

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const backendUrl = serverRuntimeConfig.backendUrl || publicRuntimeConfig.backendUrl;

const instance = axios.create({
  baseURL: backendUrl,
  withCredentials: true,
});

export default instance;
