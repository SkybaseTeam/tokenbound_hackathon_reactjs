import CustomImage from '@/components/custom/CustomImage';
import RankItem from '@/components/RankItem';
import { rankMapping } from '@/utils';
import React from 'react';

const EquippedItem = ({ data }: any) => {
  return (
    <>
      <CustomImage
        src={data?.nft_image}
        fill
        alt='err'
        className={`rounded-2xl bg-slate-100`}
        style={{
          border: `3px solid ${rankMapping(data?.nft_rank).bg}`,
        }}
      />
      <div className='absolute top-0 left-0 z-[99]'>
        <RankItem
          data={{
            rank: rankMapping(data?.nft_rank).rank,
            bg: rankMapping(data?.nft_rank).bg,
          }}
          className='!w-[24px] !h-[24px] !text-[12px] !leading-[24px]'
        />
      </div>
    </>
  );
};

export default EquippedItem;
