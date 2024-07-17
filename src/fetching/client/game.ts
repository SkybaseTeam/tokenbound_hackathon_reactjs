import { axiosClient } from './config';

export const login = async (data: any) => {
  return await axiosClient.post(`/game/login`, data);
};

export const fetchGameProfile = async (address: any, accessToken: any) => {
  return await axiosClient.get(`/game/profile/${address}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updatePoint = async (data: any, accessToken: any) => {
  return await axiosClient.post(`/game/update-point`, data, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getRewardProcess = async (
  tbaAddress: string,
  accessToken: any
) => {
  return await axiosClient.get(`/game/get-reward-process/${tbaAddress}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const claimBling = async (tbaAddress: string, accessToken: any) => {
  return await axiosClient.post(
    `/game/claim-bling`,
    {
      bling_contract: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS,
      account_contract: tbaAddress,
    },
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }
  );
};
