import { axiosClient } from './config';

export const tbaUnlisted = async (
  address: string,
  page: number,
  limit: number
) => {
  return await axiosClient.get(
    `/tba-unlisted/${address}?page=${page}&limit=${limit}`
  );
};
