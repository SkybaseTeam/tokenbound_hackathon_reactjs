import { axiosClient } from './config';

export const listedNFT = async () => {
  return await axiosClient.get('/market/listed');
};
