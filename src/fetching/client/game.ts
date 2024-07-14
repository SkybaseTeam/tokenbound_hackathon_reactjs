import { axiosClient } from './config';

export const login = async (data: any) => {
  return await axiosClient.post(`/game/login`, data);
};

export const getPoint = async (address: any) => {
  return await axiosClient.get(`/game/get-point/${address}`);
};

export const increasePoint = async (data: any) => {
  return await axiosClient.post(`/tokenbound/increase-point`, data);
};
