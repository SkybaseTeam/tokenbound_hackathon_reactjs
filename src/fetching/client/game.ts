import { axiosClient } from './config';

export const getPoint = async (address: any) => {
  return await axiosClient.get(`/tokenbound/get-point/${address}`);
};

export const increasePoint = async (data: any) => {
  return await axiosClient.post(`/tokenbound/increase-point`, data);
};
