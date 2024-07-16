'use client';

import Achievement from '@/components/Achievement';
import TbaProfile from '@/components/TbaProfile';
import { useStore } from '@/context/store';
import { getRewardProcess, updatePoint } from '@/fetching/client/game';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import useMounted from '@/hook/useMounted';
import { formatDecimal, formatWallet } from '@/utils';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

let isPostedPoint = true;

const Game = () => {
  const [text, copy] = useCopyToClipboard();
  const [blings, setBlings] = useState<any>([]);
  const router = useRouter();
  const { point, setPoint, tbaLoginData, accessToken } = useStore();

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
    setPoint((prevPoint: any) => prevPoint + 1);
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
    <div className='layout-container py-[4rem] sm:py-[6rem]'>
      <div className='flex justify-center'>
        <TbaProfile />
      </div>

      <div className='flex justify-center my-[3rem]'>
        <Achievement
          tbaLoginData={tbaLoginData}
          userPoints={point}
          accessToken={accessToken}
        />
      </div>

      {blings.map((bling: any) => (
        <div
          key={bling.id}
          className='bling z-[100]'
          style={{ left: `${bling.x}px`, top: `${bling.y}px` }}
        >
          bling
        </div>
      ))}

      <div className='flex items-center justify-center flex-col max-sm:mt-[3rem]'>
        <p className='relative z-[99] mb-[-2rem] sm:mb-[-3rem] mt-[1rem] animate-bounce'>
          Tappp me!
        </p>
        <div
          onClick={handleClick}
          className='bg-[url("/images/game/pepe.webp")] mt-[1rem] bg-contain bg-no-repeat w-[320px] h-[266px] sm:w-[560px] sm:h-[506px] cursor-pointer active:scale-[98%]'
        ></div>
        {/* <div
          onClick={handleClick}
          className='bg-[url("/images/game/touch.webp")] mt-[1rem] bg-contain bg-no-repeat w-[200px] h-[300px]  sm:w-[400px] sm:h-[600px] cursor-pointer active:scale-[98%]'
        ></div> */}
      </div>
    </div>
  );
};

export default Game;
