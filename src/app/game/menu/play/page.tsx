'use client';

import IconLogout from '@/assets/icons/IconLogout';
import Achievement from '@/components/Achievement';
import CustomImage from '@/components/custom/CustomImage';
import CustomTooltip from '@/components/custom/CustomTooltip';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { formatWallet } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const Game = () => {
  const address = '0x1234567890123456789012345678901234567890';
  const [text, copy] = useCopyToClipboard();
  const [blings, setBlings] = useState<any>([]);
  const [point, setPoint] = useState(0);
  const router = useRouter();

  const handleClick = (e: any) => {
    setPoint((prevPoint) => prevPoint + 0.1);

    const newBling = {
      id: Date.now(),
      x: e.clientX,
      y: e.clientY,
    };
    setBlings((prevBlings: any) => [...prevBlings, newBling]);

    setTimeout(() => {
      setBlings((prevBlings: any) =>
        prevBlings.filter((bling: any) => bling.id !== newBling.id)
      );
    }, 1000);
  };
  return (
    <div className='layout-container py-[6rem] sm:py-[8rem]'>
      <div className='flex justify-center'>
        <Achievement userPoints={point} />
      </div>

      <div className='flex items-center justify-between max-sm:flex-col max-sm:gap-[3rem] max-sm:mt-[1rem]'>
        <div className=''>
          <p className='text-[18px] max-sm:hidden'>Your Token-Bound Account</p>
          <div className='inline-block'>
            <div className='flex items-center rounded-2xl gap-[12px] px-[12px] py-[10px] text-[16px] font-[400] border border-[#EFFEA3] bg-[#FBFDEB] mt-[1rem]'>
              <CustomImage
                src='/images/default.webp'
                width={70}
                height={70}
                alt='err'
                className='rounded-2xl'
              />
              <div>
                <div className='flex items-center gap-[8px]'>
                  <CustomTooltip
                    title='Copied'
                    placement='right'
                    trigger={['click']}
                  >
                    <div className='cursor-pointer text-[#031F68]'>
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
                    fill='#ef4444'
                    onClick={() => {
                      router.push('/game');
                    }}
                  />
                </div>
                <div className='text-[16px] font-[400] text-[#031F68]  flex items-center mt-[8px]'>
                  <p>Points: {point.toFixed(3)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='text-[32px]'>Points: {point.toFixed(3)}</div>

        {blings.map((bling: any) => (
          <div
            key={bling.id}
            className='bling z-[100]'
            style={{ left: `${bling.x}px`, top: `${bling.y}px` }}
          >
            bling
          </div>
        ))}
      </div>

      <div className='flex items-center justify-center flex-col max-sm:mt-[3rem]'>
        <p>Tappp me!</p>
        <div
          onClick={handleClick}
          className='bg-[url("/images/game/touch.webp")] mt-[1rem] bg-contain bg-no-repeat w-[200px] h-[300px]  sm:w-[400px] sm:h-[600px] cursor-pointer active:scale-[98%]'
        ></div>
      </div>
    </div>
  );
};

export default Game;
