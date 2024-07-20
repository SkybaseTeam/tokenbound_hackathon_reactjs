import { axiosClient } from './config';

export const fetchListedTba = async (data: {
  page?: number;
  limit?: number;
  listing?: boolean;
}) => {
  return await axiosClient.get(`/tba/all`, { params: data });
};

export const fetchTbaRank = async (data: { page?: number; limit?: number }) => {
  return await axiosClient.get(`/tba/rank`, { params: data });
};
