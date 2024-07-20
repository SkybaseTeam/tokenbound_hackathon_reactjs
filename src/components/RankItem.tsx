import React from 'react';

const RankItem = ({ data, className }: any) => {
  return (
    <span
      style={{
        background: data?.bg,
      }}
      className={
        'rounded-full font-[400] text-white inline-block text-center leading-[48px] w-[48px] h-[48px] text-[18px] ' +
        className
      }
    >
      {data?.rank}
    </span>
  );
};

export default RankItem;
