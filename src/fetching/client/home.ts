import { axiosClient } from './config';

export const listedNFT = async () => {
  return await axiosClient.get('/nft/listed');
};

export const refreshOwner = async (data: any) => {
  return await axiosClient.post('/tokenbound/refresh-owner', data);
};

export const refreshListing = async (data: any) => {
  return await axiosClient.post('/market/refresh-listing', data);
};

export const refreshPrice = async (data: any) => {
  return await axiosClient.post('/tokenbound/refresh-price', data);
};
