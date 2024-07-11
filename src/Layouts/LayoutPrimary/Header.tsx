import IconCopy from '@/assets/icons/IconCopy';
import Logo from '@/components/Logo';
import CustomButton from '@/components/custom/CustomButton';
import CustomTooltip from '@/components/custom/CustomTooltip';
import { useStore } from '@/context/store';
import { formatToken, formatWallet } from '@/utils';
import {
  useAccount,
  useBalance,
  useContractRead,
  useDisconnect,
} from '@starknet-react/core';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import erc20ABI from '@/abi/erc20.json';
import { removeItemLocalStorage } from '@/utils/localStorage';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import Link from 'next/link';

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
      link: '/market/profile',
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
    <div className='grid grid-cols-3 items-center py-[10px] px-[64px]'>
      <Logo />

      <div className='flex items-center gap-[12px]'>
        {menuData.map((item: any, index: any) => (
          <Link
            href={item?.link}
            className={`${path === item?.link && '!text-[#0538BD] bg-white'} h-[36px] text-white border-white px-[12px] flex items-center rounded-[32px] border text-[16px] font-[400]`}
            key={index}
          >
            {item.title}
          </Link>
        ))}
      </div>

      <div className='flex items-center justify-end'>
        {isConnected ? (
          <div className='flex items-center gap-[1rem] max-md:hidden'>
            <div className='max-md:hidden'>
              {dcoin && address ? formatToken(dcoin, 18) : 0}{' '}
              <span className='font-[700]'>DCOIN</span> |{' '}
              {ethBalance?.data && address
                ? parseFloat(
                    formatToken(ethBalance?.data?.value as any, 18)
                  ).toFixed(3) + ' '
                : '0'}{' '}
              <span className='font-[700]'>
                {ethBalance?.data?.symbol || 'ETH'}
              </span>
            </div>
            <p
              onClick={() => {
                router.push(`/market/profile/${address}`);
              }}
              className='cursor-pointer'
            >
              {formatWallet(address)}
            </p>
            <CustomTooltip title='Copied' placement='right' trigger={['click']}>
              <IconCopy
                className='cursor-pointer'
                onClick={() => copy(address as string)}
              />
            </CustomTooltip>
            <CustomButton onClick={handleDisconnect} className='btn-secondary'>
              Disconnect
            </CustomButton>
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
