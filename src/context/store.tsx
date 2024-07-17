'use client';

import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useConnect, useProvider } from '@starknet-react/core';
import { createContext, useContext, useEffect, useState } from 'react';
import { Contract } from 'starknet';
import { useStarknetkitConnectModal } from 'starknetkit';
import erc20abi from '@/abi/erc20.json';
import useMounted from '@/hook/useMounted';
import { profile } from '@/fetching/client/profile';
import { fetchGameProfile } from '@/fetching/client/game';

const storeContext = createContext<any>(null);

export const useStore = () => useContext(storeContext);

const StoreProvider = ({ children }: any) => {
  const [userLoginData, setUserLoginData] = useState<any>(true);
  const { provider } = useProvider();
  const { connect, connectors } = useConnect();
  const [dcoin, setDcoin] = useState(0);
  const { isMounted } = useMounted();
  const [point, setPoint] = useState(undefined);
  const { address, account } = useAccount();
  const [profileData, setProfileData] = useState<any>();
  const [tbaLoginData, setTbaLoginData] = useState<any>();
  const [accessToken, setAccessToken] = useState<any>();
  const [listedNFTData, setListedNFTData] = useState<any>();
  const [blingTba, setBlingTba] = useState(0);
  const [showModalWaitTransaction, setShowModalWaitTransaction] =
    useState(false);

  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any,
  });

  const connectWallet = async () => {
    const { connector }: any = await starknetkitConnectModal();
    connect({ connector });
  };

  const getDcoin = async () => {
    const erc20Contract = new Contract(
      erc20abi,
      process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
      provider
    );
    const dcoin = await erc20Contract.balanceOf(address);
    setDcoin(dcoin);
  };

  const getProfile = async () => {
    try {
      const profileResponse: any = await profile(address?.toLocaleLowerCase());
      const data = profileResponse?.data?.data;
      setProfileData(data);
    } catch (err) {
      toastError('Get profile failed');
      console.log(err);
    }
  };

  const getGameProfile = async () => {
    try {
      const profileResponse: any = await fetchGameProfile(
        tbaLoginData?.tba_address?.toLocaleLowerCase(),
        accessToken
      );
      const data = profileResponse?.data?.data;
      setTbaLoginData(data);
      setPoint(data?.point);
    } catch (err) {
      toastError('Get profile failed');
      console.log(err);
    }
  };

  const getBlingOfTba = async () => {
    const erc20Contract = new Contract(
      erc20abi,
      process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
      provider
    );
    const bling = await erc20Contract.balanceOf(tbaLoginData?.tba_address);
    setBlingTba(Number(bling) / 10 ** 18);
  };

  return (
    <storeContext.Provider
      value={{
        userLoginData,
        setUserLoginData,
        connectWallet,
        getDcoin,
        dcoin,
        profileData,
        getProfile,
        getGameProfile,
        tbaLoginData,
        setTbaLoginData,
        accessToken,
        setAccessToken,
        listedNFTData,
        setListedNFTData,
        blingTba,
        getBlingOfTba,
        showModalWaitTransaction,
        setShowModalWaitTransaction,
        point,
        setPoint,
      }}
    >
      {children}
    </storeContext.Provider>
  );
};
export default StoreProvider;
