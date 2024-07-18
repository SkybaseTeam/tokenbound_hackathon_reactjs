import React from 'react';
import CustomImage from './custom/CustomImage';

const CardRank = () => {
  return (
    <div className='bg-[#3760CA] p-[12px] rounded-2xl flex gap-[16px] items-center justify-between'>
      <div className='flex items-center gap-[16px]'>
        <div className='text-[#0538BD] w-[52px] h-[52px] border-[2px] text-center rounded-full border-[#0538BD] bg-[#DCFC36] text-[38px] font-[400]'>
          1
        </div>
        <div className='flex items-center gap-[12px]'>
          <CustomImage
            alt='err'
            src='/images/default.png'
            width={53}
            height={53}
            className='rounded'
          />
          <div>
            <p className='uppercase text-[18px] text-white'>
              BLING BLING #4351
            </p>
            <p className='text-[16px] text-[#DCFC36]'>0xd...67a</p>
          </div>
        </div>
      </div>
      <div>
        <p className='text[16px] text-[#8CA3E1]'>Power</p>
        <p className='text-[#DCFC36] font-[500] text-[30px]'>150</p>
      </div>
    </div>
  );
};

export default CardRank;
