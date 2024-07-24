import { axiosClient } from './config';

export const refreshOwner = async (data: any) => {
  return await axiosClient.post('/market/refresh-owner', data);
};

export const refreshListing = async (data: any) => {
  return await axiosClient.post('/market/refresh-listing', data);
};
