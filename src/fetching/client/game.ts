import { axiosClient } from './config';

export const point = async (address: any) => {
  return await axiosClient.get(`/tokenbound/get-point/${address}`);
};
