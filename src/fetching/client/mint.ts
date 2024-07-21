import { axiosClient } from './config';

export const collectionData = async () => {
  return await axiosClient.get('/collection');
};

export const refreshMintStatus = async (data: any) => {
  return await axiosClient.post('/tba/refresh-mint-status', data);
};

export const refreshNftMintStatus = async (data: any) => {
  return await axiosClient.post('/nft/refresh-mint-status', data);
};

export const fetchNft = async ({ tbaAddress, ...data }: any) => {
  return await axiosClient.get(`/nft/get-nft/${tbaAddress}`, { params: data });
};
