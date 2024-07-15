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
      <p className='text-[18px]'>Your Token-Bound Account</p>
      <div className='inline-block'>
        <div className='flex items-center rounded-2xl gap-[12px] px-[12px] py-[10px] text-[16px] font-[400] border border-[#EFFEA3] bg-[#FBFDEB] mt-[1rem]'>
          <CustomImage
            src={tbaLoginData?.tba_image}
            width={70}
            height={70}
            alt='err'
            className='rounded-2xl'
          />
          <div>
            <div className='flex items-center gap-[8px]'>
              <CustomTooltip
                title='Copied Address'
                placement='right'
                trigger={['click']}
              >
                <div className='cursor-pointer text-[#031F68]'>
                  <p
                    onClick={() => copy(tbaLoginData?.tba_address as string)}
                    // className='mt-[0.3rem]'
                  >
                    {tbaLoginData?.tba_name}
                  </p>
                </div>
              </CustomTooltip>
              <IconLogout
                className='cursor-pointer'
                fill='#ef4444'
                onClick={() => {
                  window.location.reload();
                }}
              />
            </div>
            <div className='text-[16px] font-[400] text-[#031F68]  flex items-center mt-[8px]'>
              <p>
                Points: {formatDecimal(Number(point))}{' '}
                <span className='px-[0.5rem]'>|</span> Total: {bling || 0} Bling
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TbaProfile;
