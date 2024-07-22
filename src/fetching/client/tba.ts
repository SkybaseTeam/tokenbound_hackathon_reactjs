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

export const uploadTbaImage = async (data: any, accessToken: any) => {
  return await axiosClient.post(`/tba/upload`, data, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
