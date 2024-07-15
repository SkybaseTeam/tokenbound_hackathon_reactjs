import { axiosClient } from './config';

export const login = async (data: any) => {
  return await axiosClient.post(`/game/login`, data);
};

export const getPoint = async (address: any) => {
  return await axiosClient.get(`/game/get-point/${address}`);
};

export const updatePoint = async (data: any, accessToken: any) => {
  return await axiosClient.post(`/game/update-point`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};
