import { HttpStatusCode } from 'axios';
import axios from '@/app/(core)/utils/axios.utils';
import { FC } from 'react';

const getPosts = async () => {
  try {
    const response = await axios.get('/posts');

    if (response.status === HttpStatusCode.Ok) {
      return response.data;
    }
  } catch (error) {
    console.log(error);
  }

  return [];
};

const Home: FC = async () => {
  const users = await getPosts();

  return <>{JSON.stringify(users)}</>;
};

export default Home;
