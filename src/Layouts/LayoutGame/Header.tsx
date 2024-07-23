import Logo from '@/components/Logo';

import CustomTooltip from '@/components/custom/CustomTooltip';
import { useStore } from '@/context/store';
import { formatToken, formatWallet, tbaPowerBg } from '@/utils';
import {
  useAccount,
  useBalance,
  useDisconnect,
  useProvider,
} from '@starknet-react/core';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import IconLogout from '@/assets/icons/IconLogout';
import useMounted from '@/hook/useMounted';
import IconHamburger from '@/assets/icons/IconHamburger';
import DrawerMobile from '@/components/drawer/DrawerMobile';
import IconGamePlay from '@/assets/icons/IconGamePlay';
import IconProfile from '@/assets/icons/IconProfile';
import { CallData, Contract } from 'starknet';
import { toastError, toastSuccess } from '@/utils/toast';
import CustomImage from '@/components/custom/CustomImage';
import CustomButton from '@/components/custom/CustomButton';
import DrawerMobileGame from '@/components/drawer/DrawerMobileGame';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import IconGacha from '@/assets/icons/IconGacha';
import IconLeaderBoard from '@/assets/icons/IconLeaderBoard';
import IconInventory from '@/assets/icons/IconInventory';

const Header = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [text, copy] = useCopyToClipboard();
  const {
    connectWallet,
    tbaLoginData,
    getBlingOfTba,
    blingTba,
    getDcoin,
    getGameProfile,
    setShowModalWaitTransaction,
    setAccessToken,
    accessToken,
  } = useStore();
  const path = usePathname();
  const [showDrawerMobile, setShowDrawerMobile] = useState(false);
  const { provider } = useProvider();
  const [loadingWithDraw, setLoadingWithDraw] = useState(false);
  const { account } = useAccount();
  const { isMounted } = useMounted();
  const [openModalTbaDetail, setOpenModalTbaDetail] = useState(false);

  const menuData: any = [
    {
      title: 'Play',
      link: '/game/play',
      icon: (
        <IconGamePlay fill={path === `/game/play` ? '#0538BD' : '#8CA3E1'} />
      ),
    },
    {
      title: 'Gacha',
      link: `/game/play/gacha`,
      icon: (
        <IconGacha fill={path === `/game/play/gacha` ? '#0538BD' : '#8CA3E1'} />
      ),
    },
    {
      title: 'Ranking',
      link: `/game/play/ranking`,
      icon: (
        <IconLeaderBoard
          fill={path === `/game/play/ranking` ? '#0538BD' : '#8CA3E1'}
        />
      ),
    },
    {
      title: 'Inventory',
      link: `/game/play/inventory`,
      icon: (
        <IconInventory
          fill={path === `/game/play/inventory` ? '#0538BD' : '#8CA3E1'}
        />
      ),
    },
  ];

  /* const ethBalance = useBalance({
    address,
    watch: false,
  }); */

  useEffect(() => {
    isMounted && accessToken && getGameProfile();
  }, [isMounted, accessToken]);

  useEffect(() => {
    if (isMounted && tbaLoginData?.tba_address) {
      getBlingOfTba();
    }
  }, [isMounted, tbaLoginData?.tba_address]);

  const onWithDraw = async () => {
    setLoadingWithDraw(true);
    try {
      // mint BLING
      const tx = await account?.execute([
        {
          contractAddress: tbaLoginData?.tba_address,
          entrypoint: 'withdraw',
          calldata: CallData.compile({
            token_contract: process.env
              .NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
          }),
        },
      ]);
      setShowModalWaitTransaction(true);
      await provider.waitForTransaction(tx?.transaction_hash as any);
      await Promise.allSettled([getDcoin(), getBlingOfTba()]);
      toastSuccess('WithDraw success');
    } catch (error) {
      toastError('WithDraw failed, try reconnect your wallet!');
      console.log(error);
    } finally {
      setLoadingWithDraw(false);
      setShowModalWaitTransaction(false);
    }
  };

  const handleDisconnect = () => {
    router.push('/game');
    setAccessToken(undefined);
  };

  return (
    <div
      id='header'
      className={`bg-[#0538BD] bg-opacity-50 transition-all duration-500  flex gap-[9px] lg:grid lg:grid-cols-3 items-center py-[10px] px-[16px] sm:px-[32px] lg:px-[64px] fixed z-[999] w-full top-0 h-[56px] lg:h-[68px]`}
    >
      <DrawerMobileGame
        ethBalance={1}
        open={showDrawerMobile}
        onClose={() => {
          setShowDrawerMobile(false);
        }}
        handleDisconnect={handleDisconnect}
        tbaLoginData={tbaLoginData}
        setAccessToken={setAccessToken}
        loadingWithDraw={loadingWithDraw}
        onWithDraw={onWithDraw}
        blingTba={blingTba}
      />

      <IconHamburger
        onClick={() => {
          setShowDrawerMobile(true);
        }}
        className='lg:hidden cursor-auto'
      />

      <Logo />

      {/* PC */}
      <div className='flex items-center gap-[12px] justify-center max-lg:hidden'>
        {menuData.map((item: any, index: any) => (
          <div
            onClick={() => {
              if (
                (item?.link?.includes('/profile') || item?.link === '/game') &&
                !isConnected
              ) {
                connectWallet();
                return;
              }
              router.push(item?.link);
            }}
            className={`${(path === item?.link || (item?.link === '/game' && path?.includes(item?.link))) && '!text-[#0538BD] bg-white'} cursor-pointer hover:!text-[#0538BD] hover:bg-white h-[36px] transition-all text-white border-white px-[12px] flex items-center rounded-[32px] border text-[16px] font-[400]`}
            key={index}
          >
            <p /* className='mt-[0.3rem]' */> {item.title}</p>
          </div>
        ))}
      </div>
      {/* Mobile */}
      <div
        className={` bg-white lg:hidden p-[16px] rounded-tl-[16px] rounded-tr-[16px] fixed bottom-0 left-0 right-0 flex border-[#587AD3] border-t border-r border-l justify-between`}
      >
        {menuData.map((item: any, index: any) => (
          <div
            onClick={() => {
              if (
                (item?.link?.includes('/profile') || item?.link === '/game') &&
                !isConnected
              ) {
                connectWallet();
                return;
              }
              router.push(item?.link);
            }}
            key={index}
            className={`${(path === item?.link || (item?.link === '/game' && path?.includes(item?.link))) && '!text-[#0538BD]'} cursor-pointer text-[#8CA3E1] text-[12px] font-[400] flex flex-col items-center gap-[4px]`}
          >
            {item?.icon}
            {item?.title}
          </div>
        ))}
      </div>

      {accessToken && (
        <div className='flex items-center justify-end max-lg:hidden'>
          <div className='flex items-center gap-[1rem] max-md:hidden'>
            <div className='max-md:hidden border border-[#DCFC36] text-[16px] font-[400] text-[#DCFC36] px-[12px] py-[6px] rounded-[32px] flex items-center '>
              <div /* className=' mt-[0.3rem]' */>
                {blingTba || 0} BLING
                {/*   {ethBalance?.data && address
                ? formatToken(ethBalance?.data?.value as any, 18) + ' '
                : '0'}{' '}
              {ethBalance?.data?.symbol || 'ETH'} */}
                <span className='px-[10px]'>|</span>
                <CustomButton
                  loading={loadingWithDraw}
                  className='btn-primary h-[2.2rem]'
                  onClick={onWithDraw}
                  disabled={blingTba <= 0}
                >
                  WithDraw
                </CustomButton>
              </div>
            </div>

            <div className='flex items-center rounded-full gap-[10px] px-[12px] text-[16px] font-[400] border py-[6px] border-white '>
              <CustomImage
                src={tbaLoginData?.tba_image}
                width={35}
                height={35}
                alt='err'
                className='rounded-full'
              />

              <p
                onClick={() => {
                  setOpenModalTbaDetail(true);
                }}
                className='cursor-pointer'
              >
                {formatWallet(tbaLoginData?.tba_address)}
              </p>

              <IconLogout
                className='cursor-pointer'
                onClick={handleDisconnect}
                fill='#ef4444'
              />
            </div>
          </div>
        </div>
      )}
      <ModalTbaDetail
        open={openModalTbaDetail}
        onCancel={() => {
          setOpenModalTbaDetail(false);
        }}
        showBuy={false}
        selectedNFT={tbaLoginData}
      />
    </div>
  );
};

export default Header;
