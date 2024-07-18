import { axiosClient } from './config';

export const fetchUserTbaList = async ({
  address,
  page,
  limit,
  listing,
}: {
  address: any;
  page?: number;
  limit?: number;
  listing?: boolean;
}) => {
  return await axiosClient.get(
    `/user/tba/${address}?page=${page}&limit=${limit}&listing=${listing}`
  );
};
