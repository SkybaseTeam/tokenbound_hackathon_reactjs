import { axiosClient } from './config';

export const collectionData = async () => {
  return await axiosClient.get('/collection');
};

export const refreshMintStatus = async (data: any) => {
  return await axiosClient.post('/tba/refresh-mint-status', data);
};
