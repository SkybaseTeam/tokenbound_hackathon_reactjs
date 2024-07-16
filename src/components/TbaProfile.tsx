import React, { useEffect, useState } from 'react';
import CustomImage from './custom/CustomImage';
import CustomTooltip from './custom/CustomTooltip';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { formatDecimal, formatWallet } from '@/utils';
import IconLogout from '@/assets/icons/IconLogout';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store';
import useMounted from '@/hook/useMounted';
import erc20abi from '@/abi/erc20.json';
import { Contract } from 'starknet';
import { useProvider } from '@starknet-react/core';
import CustomButton from './custom/CustomButton';

const TbaProfile = () => {
  const [text, copy] = useCopyToClipboard();
  const router = useRouter();
  const { point, tbaLoginData, setPoint, getBlingOfTba, blingTba } = useStore();
  const { provider } = useProvider();

  const { isMounted } = useMounted();
  useEffect(() => {
    setPoint(tbaLoginData?.point);
  }, []);

  useEffect(() => {
    if (isMounted && tbaLoginData?.tba_address) {
      getBlingOfTba();
    }
  }, [isMounted, tbaLoginData?.tba_address]);

  return (
    <div className=''>
      <div className='flex items-start rounded-2xl justify-between p-[12px] text-[16px] font-[400] bg-[#3760CA] mt-[1rem]'>
        <div>
          <div className='flex items-start sm:items-center gap-[12px]'>
            <CustomImage
              src={tbaLoginData?.tba_image}
              width={110}
              height={110}
              alt='err'
              className='rounded-2xl max-sm:w-[60px]'
            />
            <div>
              <p className='text-[18px] max-sm:hidden'>My Tokenbound Account</p>
              <p className='text-[18px] sm:hidden'>My TBA</p>
              <div className='flex items-center gap-[8px] mt-[4px]'>
                <CustomTooltip
                  title='Copied Address'
                  placement='right'
                  trigger={['click']}
                >
                  <div className='cursor-pointer text-white'>
                    <p
                      onClick={() => copy(tbaLoginData?.tba_address as string)}
                      // className='mt-[0.3rem]'
                    >
                      {tbaLoginData?.tba_name}
                    </p>
                  </div>
                </CustomTooltip>
              </div>

              <div className='flex items-center gap-[12px] max-sm:hidden'>
                <div className='border border-[#DCFC36] text-[16px] font-[400] text-[#DCFC36] px-[12px] h-[36px] rounded-[32px] mt-[8px] inline-block'>
                  <div className=' mt-[0.3rem]'>
                    <p>
                      Points: {formatDecimal(Number(point))}{' '}
                      <span className='px-[0.5rem]'>|</span> Amount:{' '}
                      {blingTba || 0} BLING
                    </p>
                  </div>
                </div>
                <CustomButton className='btn-primary max-sm:hidden'>
                  WithDraw
                </CustomButton>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-[12px] mt-[0.3rem] sm:hidden'>
            <div className='text-[16px] border border-[#DCFC36] font-[400] text-[#DCFC36] px-[12px] py-[6px] rounded-[16px] mt-[8px]'>
              <p className='border-b border-[#DCFC36]'>
                Points: {formatDecimal(Number(point))}
              </p>
              <p>Amount: {blingTba || 0} BLING</p>
            </div>
            <CustomButton className='btn-primary max-sm:!text-[14px] max-sm:px-[10px] max-sm:!h-[45px] max-sm:!rounded-xl'>
              WithDraw
            </CustomButton>
          </div>
        </div>

        <IconLogout
          className='cursor-pointer'
          fill='#ef4444'
          onClick={() => {
            router.push('/game');
            // setTimeout(() => {
            //   window.location.reload();
            // }, 500);
          }}
        />
      </div>
    </div>
  );
};

export default TbaProfile;
