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
  const { point, tbaLoginData, setPoint } = useStore();
  const { provider } = useProvider();
  const [bling, setBling] = useState(0);
  const { isMounted } = useMounted();
  useEffect(() => {
    setPoint(tbaLoginData?.point);
  }, []);

  const getBlingOfTba = async () => {
    const erc20Contract = new Contract(
      erc20abi,
      process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
      provider
    );
    const bling = await erc20Contract.balanceOf(tbaLoginData?.tba_address);
    setBling(Number(bling) / 10 ** 18);
  };

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
                      {bling || 0} BLING
                    </p>
                  </div>
                </div>
                <CustomButton className='btn-primary max-sm:hidden'>
                  WithDraw
                </CustomButton>
              </div>
            </div>
          </div>
        </div>

        <IconLogout
          className='cursor-pointer'
          fill='#ef4444'
          onClick={() => {
            window.location.reload();
          }}
        />
      </div>
      <div className='flex items-center gap-[12px] mt-[1rem] sm:hidden'>
        <div className='text-[16px] font-[400] text-[#DCFC36] px-[12px] rounded-[32px] mt-[8px]'>
          <p>Points: {formatDecimal(Number(point))}</p>
          <p>Amount: {bling || 0} BLING</p>
        </div>
        <CustomButton className='btn-primary'>WithDraw</CustomButton>
      </div>
    </div>
  );
};

export default TbaProfile;
