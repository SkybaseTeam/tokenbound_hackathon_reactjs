'use client';

import { login } from '@/fetching/client/auth';
import { setItemLocalStorage } from '@/utils/localStorage';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useConnect, useProvider } from '@starknet-react/core';
import { createContext, useContext, useEffect, useState } from 'react';
import { Contract } from 'starknet';
import { useStarknetkitConnectModal } from 'starknetkit';
import erc20abi from '@/abi/erc20.json';
import useMounted from '@/hook/useMounted';
import { profile } from '@/fetching/client/profile';

const storeContext = createContext<any>(null);

export const useStore = () => useContext(storeContext);

const StoreProvider = ({ children }: any) => {
  const [userLoginData, setUserLoginData] = useState<any>(true);
  const { provider } = useProvider();
  const { connect, connectors } = useConnect();
  const [dcoin, setDcoin] = useState(0);
  const { isMounted } = useMounted();
  const { starknetkitConnectModal } = useStarknetkitConnectModal({
    connectors: connectors as any,
  });
  const { address } = useAccount();
  const [profileData, setProfileData] = useState<any>();

  const connectWallet = async () => {
    const { connector }: any = await starknetkitConnectModal();
    connect({ connector });
  };

  useEffect(() => {
    if (!address) return;

    // const handleLogin = async () => {
    //   try {
    //     const loginResponse = await login({
    //       address,
    //     });
    //     const token = loginResponse?.data?.data?.token;
    //     setItemLocalStorage('token', token);
    //   } catch (error) {
    //     toastError('Login failed');
    //     console.log(error);
    //   }
    // };

    // handleLogin();
  }, [address]);

  const getDcoin = async () => {
    const erc20Contract = new Contract(
      erc20abi,
      process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
      provider
    );
    const dcoin = await erc20Contract.balanceOf(address);
    setDcoin(dcoin);
  };

  useEffect(() => {
    if (isMounted && address) {
      getDcoin();
    }
  }, [isMounted, address]);

  const getProfile = async () => {
    try {
      const profileResponse: any = await profile(address?.toLocaleLowerCase());
      const data = profileResponse?.data;
      setProfileData(data);
    } catch (err) {
      toastError('Get profile failed');
      console.log(err);
    }
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
      }}
    >
      {children}
    </storeContext.Provider>
  );
};
export default StoreProvider;
