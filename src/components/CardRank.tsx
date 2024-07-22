import React from 'react';
import CustomImage from './custom/CustomImage';
import { formatWallet, tbaPowerBg } from '@/utils';

const CardRank = ({ data }: any) => {
  return (
    <div className='bg-[#3760CA] cursor-pointer hover:translate-y-[-0.3rem] hover:scale-105 transition-all p-[12px] rounded-2xl flex gap-[16px] items-center justify-between'>
      <div className='flex items-center gap-[16px]'>
        <div className='text-[#0538BD] w-[52px] h-[52px] border-[2px] flex items-center justify-center rounded-full border-[#0538BD] bg-[#DCFC36] text-[30px] font-[400]'>
          {data?.rank}
        </div>
        <div className='flex items-center gap-[12px]'>
          <CustomImage
            alt='err'
            src={data?.tba_image}
            width={53}
            height={53}
            className='rounded'
            style={{
              background: tbaPowerBg(data?.power),
            }}
          />
          <div>
            <p className='uppercase text-[18px] text-white'>{data?.tba_name}</p>
            <p className='text-[16px] text-[#DCFC36]'>
              {formatWallet(data?.tba_address)}
            </p>
          </div>
        </div>
      </div>
      <div>
        <p className='text[16px] text-[#8CA3E1]'>Power</p>
        <p className='text-[#DCFC36] font-[500] text-[30px]'>{data?.power}</p>
      </div>
    </div>
  );
};

export default CardRank;
