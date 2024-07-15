'use client';

import Achievement from '@/components/Achievement';
import TbaProfile from '@/components/TbaProfile';
import { useStore } from '@/context/store';
import { updatePoint } from '@/fetching/client/game';
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
    setPoint((prevPoint: any) => prevPoint + 0.1);
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
    <div className='layout-container py-[6rem] sm:py-[8rem]'>
      <div className='flex justify-center'>
        <Achievement userPoints={point} />
      </div>

      <div className='flex items-center justify-between max-sm:flex-col max-sm:gap-[3rem] max-sm:mt-[1rem]'>
        <TbaProfile />

        <div className='text-[32px]'>Points: {formatDecimal(point)}</div>

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
