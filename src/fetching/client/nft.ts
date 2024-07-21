import { axiosClient } from './config';

export const refreshEquip = async (data: any) => {
  return await axiosClient.post('/nft/refresh-equip-status', data);
};
