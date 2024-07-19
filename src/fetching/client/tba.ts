import { axiosClient } from './config';

export const fetchListedTba = async ({
  page,
  limit,
  listing,
}: {
  page?: number;
  limit?: number;
  listing?: boolean;
}) => {
  return await axiosClient.get(
    `/tba/all?page=${page}&limit=${limit}&listing=${listing}`
  );
};

export const fetchTbaRank = async ({
  page,
  limit,
}: {
  page?: number;
  limit?: number;
}) => {
  return await axiosClient.get(`/tba/rank?page=${page}&limit=${limit}`);
};
