'use client';

import Achievement from '@/components/Achievement';
import CustomImage from '@/components/custom/CustomImage';
import { POINT_PER_CLICK } from '@/constant';
import { useStore } from '@/context/store';
import { updatePoint } from '@/fetching/client/game';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import useMounted from '@/hook/useMounted';
import { formatDecimal, formatWallet } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

let isPostedPoint = true;

const Play = () => {
  const [text, copy] = useCopyToClipboard();
  const [blings, setBlings] = useState<any>([]);
  const router = useRouter();
  const { point, setPoint, tbaLoginData, accessToken, getGameProfile } =
    useStore();
  const { isMounted } = useMounted();

  useEffect(() => {
    const interval = setInterval(() => {
      if (isPostedPoint) return;

      updatePoint(
        {
          tba_address: tbaLoginData?.tba_address,
          point,
        },
        accessToken
      );
      isPostedPoint = true;
    }, 1000);
    return () => clearInterval(interval);
  }, [accessToken, tbaLoginData?.tba_address, point]);

  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }
  }, []);

  const handleClick = async (e: any) => {
    setPoint((prevPoint: any) => prevPoint + POINT_PER_CLICK);
    isPostedPoint = false;

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
    accessToken && (
      <div className='relative '>
        {blings.map((bling: any) => (
          <div
            key={bling.id}
            className='bling z-[100]'
            style={{ left: `${bling.x}px`, top: `${bling.y}px` }}
          >
            <CustomImage
              alt='err'
              src='/images/token/bling.webp'
              width={45}
              height={45}
            />
            BLING
          </div>
        ))}
        <div className='layout-container py-[4rem] sm:pb-0 sm:pt-[6rem] relative'>
          <p className='text-[38px] sm:text-[48px] font-[500] text-white max-lg:text-center lg:absolute left-[5rem] top-[8rem]'>
            Points: {formatDecimal(Number(point))}
          </p>

          <div className='flex justify-center mt-[1rem] sm:my-[3rem]'>
            <Achievement
              tbaLoginData={tbaLoginData}
              userPoints={point}
              accessToken={accessToken}
            />
          </div>

          <div className='flex items-center justify-center flex-col max-sm:mt-[3rem]'>
            <p className='relative z-[99] mt-[1rem] animate-bounce'>
              Tappp me!
            </p>
            {/* <div
        onClick={handleClick}
        className='bg-[url("/images/game/pepe.webp")] mt-[1rem] bg-contain bg-no-repeat w-[320px] h-[266px] sm:w-[560px] sm:h-[506px] cursor-pointer active:scale-[98%]'
      ></div> */}
            <div
              onClick={handleClick}
              className='bg-[url("/images/game/touch.webp")] mt-[1rem] bg-contain bg-no-repeat w-[200px] h-[300px]  sm:w-[400px] sm:h-[600px] cursor-pointer active:scale-[98%]'
            ></div>
          </div>
        </div>
      </div>
    )
  );
};

export default Play;
