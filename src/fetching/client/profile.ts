import { axiosClient } from './config';

export const profile = async (address: string, page: number, limit: number) => {
  return await axiosClient.get(
    `/user/profile/${address}?page=${page}&limit=${limit}`
  );
};
