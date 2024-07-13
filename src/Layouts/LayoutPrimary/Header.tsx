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
import IconHamburger from '@/assets/icons/IconHamburger';
import DrawerMobile from '@/components/drawer/DrawerMobile';
import IconHome from '@/assets/icons/IconHome';
import IconMarketPlace from '@/assets/icons/IcconMarketPlace';
import IconGamePlay from '@/assets/icons/IconGamePlay';
import IconProfile from '@/assets/icons/IconProfile';

const Header = () => {
  const { disconnect } = useDisconnect();
  const { address, isConnected } = useAccount();
  const router = useRouter();
  const [text, copy] = useCopyToClipboard();
  const { connectWallet, dcoin } = useStore();
  const path = usePathname();
  const [showDrawerMobile, setShowDrawerMobile] = useState(false);

  const menuData: any = [
    {
      title: 'Homepage',
      link: '/',
      icon: <IconHome fill={path === '/' ? '#0538BD' : '#8CA3E1'} />,
    },
    {
      title: 'Marketplace',
      link: '/market',
      icon: (
        <IconMarketPlace fill={path === '/market' ? '#0538BD' : '#8CA3E1'} />
      ),
    },
    {
      title: 'Gameplay',
      link: '/play',
      icon: <IconGamePlay fill={path === '/play' ? '#0538BD' : '#8CA3E1'} />,
    },
    {
      title: 'Profile',
      link: `/market/profile/${address}`,
      icon: (
        <IconProfile
          fill={path === `/market/profile/${address}` ? '#0538BD' : '#8CA3E1'}
        />
      ),
    },
  ];

  console.log(path);

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
      className={`bg-[#0538BD] transition-all duration-500  flex gap-[9px] lg:grid lg:grid-cols-3 items-center py-[10px] px-[16px] sm:px-[32px] lg:px-[64px] fixed z-[999] w-full top-0 h-[56px] lg:h-[68px]`}
    >
      <DrawerMobile
        ethBalance={ethBalance}
        open={showDrawerMobile}
        onClose={() => {
          setShowDrawerMobile(false);
        }}
        handleDisconnect={handleDisconnect}
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
                (item?.link?.includes('/market/profile') ||
                  item?.link === '/play') &&
                !isConnected
              ) {
                connectWallet();
                return;
              }
              router.push(item?.link);
            }}
            className={`${path === item?.link && '!text-[#0538BD] bg-white'} cursor-pointer hover:!text-[#0538BD] hover:bg-white h-[36px] transition-all text-white border-white px-[12px] flex items-center rounded-[32px] border text-[16px] font-[400]`}
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
                (item?.link?.includes('/market/profile') ||
                  item?.link === '/play') &&
                !isConnected
              ) {
                connectWallet();
                return;
              }
              router.push(item?.link);
            }}
            key={index}
            className={`${path === item?.link && '!text-[#0538BD]'} cursor-pointer text-[#8CA3E1] text-[12px] font-[400] flex flex-col items-center gap-[4px]`}
          >
            {item?.icon}
            {item?.title}
          </div>
        ))}
      </div>

      <div className='flex items-center justify-end max-lg:hidden'>
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
