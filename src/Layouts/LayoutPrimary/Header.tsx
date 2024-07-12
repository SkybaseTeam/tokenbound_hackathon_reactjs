import Logo from '@/components/Logo';
import CustomButton from '@/components/custom/CustomButton';
import CustomTooltip from '@/components/custom/CustomTooltip';
import { useStore } from '@/context/store';
import { formatToken, formatWallet } from '@/utils';
import { useAccount, useBalance, useDisconnect } from '@starknet-react/core';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { removeItemLocalStorage } from '@/utils/localStorage';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import Link from 'next/link';
import IconLogout from '@/assets/icons/IconLogout';
import useMounted from '@/hook/useMounted';

const Header = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [text, copy] = useCopyToClipboard();
  const { connectWallet, dcoin } = useStore();
  const path = usePathname();

  const menuData: any = [
    {
      title: 'Homepage',
      link: '/',
    },
    {
      title: 'Marketplace',
      link: '/market',
    },
    {
      title: 'Gameplay',
      link: '/play',
    },
    {
      title: 'Profile',
      link: `/market/profile/${address}`,
    },
  ];

  const ethBalance = useBalance({
    address,
    watch: false,
  });

  const handleDisconnect = () => {
    disconnect();
    removeItemLocalStorage('token');
  };

  return (
    <div
      id='header'
      className={`bg-[#0538BD] bg-opacity-80 transition-all duration-500 grid grid-cols-3 items-center py-[10px] px-[64px] fixed z-[999] w-full top-0 h-[68px]`}
    >
      <Logo />

      <div className='flex items-center gap-[12px] justify-center'>
        {menuData.map((item: any, index: any) => (
          <Link
            href={item?.link}
            className={`${path === item?.link && '!text-[#0538BD] bg-white'} hover:!text-[#0538BD] hover:bg-white h-[36px] transition-all text-white border-white px-[12px] flex items-center rounded-[32px] border text-[16px] font-[400]`}
            key={index}
          >
            <p /* className='mt-[0.3rem]' */> {item.title}</p>
          </Link>
        ))}
      </div>

      <div className='flex items-center justify-end'>
        {isConnected ? (
          <div className='flex items-center gap-[1rem] max-md:hidden'>
            <div className='max-md:hidden border border-[#DCFC36] text-[16px] font-[400] text-[#DCFC36] px-[12px] h-[36px] rounded-[32px] flex items-center '>
              <div /* className=' mt-[0.3rem]' */>
                {dcoin && address ? formatToken(dcoin, 18) : 0} BLING
                <span className='px-[10px]'>|</span>
                {ethBalance?.data && address
                  ? parseFloat(
                      formatToken(ethBalance?.data?.value as any, 18)
                    ).toFixed(3) + ' '
                  : '0'}{' '}
                {ethBalance?.data?.symbol || 'ETH'}
              </div>
            </div>

            <div className='flex items-center rounded-[32px] gap-[10px] px-[12px] h-[36px] text-[16px] font-[400] border border-white'>
              <CustomTooltip
                title='Copied'
                placement='right'
                trigger={['click']}
              >
                <div className='cursor-pointer '>
                  <p
                    onClick={() => copy(address as string)}
                    // className='mt-[0.3rem]'
                  >
                    {formatWallet(address)}
                  </p>
                </div>
              </CustomTooltip>
              <IconLogout
                className='cursor-pointer'
                onClick={handleDisconnect}
              />
            </div>
          </div>
        ) : (
          <CustomButton
            onClick={connectWallet}
            className='btn-primary max-md:hidden w-[160px]'
          >
            Connect Wallet
          </CustomButton>
        )}
      </div>
    </div>
  );
};

export default Header;
