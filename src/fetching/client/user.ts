import { axiosClient } from './config';

export const fetchUserTbaList = async ({
  address,
  ...data
}: {
  address: any;
  page?: number;
  limit?: number;
  listing?: boolean;
}) => {
  return await axiosClient.get(`/user/tba/${address}`, { params: data });
};
