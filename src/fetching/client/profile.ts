import { axiosClient } from './config';

export const profile = async (address: any) => {
  return await axiosClient.get(`/user/profile/${address}`);
};
