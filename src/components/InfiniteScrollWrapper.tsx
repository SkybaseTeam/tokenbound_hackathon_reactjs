import { useStore } from '@/context/store';
import { useAccount } from '@starknet-react/core';
import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import ListNftSkeleton from './custom/CustomSkeleton/ListNftSkeleton';

const InfiniteScrollWrapper = ({
  listData,
  renderData,
}: {
  listData: any;
  renderData: any;
}) => {
  const { address } = useAccount();
  const { getProfile } = useStore();
  return (
    <>
      {address ? (
        listData !== undefined ? (
          listData?.data?.length > 0 ? (
            <InfiniteScroll
              dataLength={listData?.data?.length}
              next={getProfile}
              hasMore={listData?.pagination?.hasMore}
              loader={<ListNftSkeleton />}
            >
              <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[16px]'>
                {renderData}
              </div>
            </InfiniteScroll>
          ) : (
            <div className='text-[#031F68]'>No Data!</div>
          )
        ) : (
          <ListNftSkeleton />
        )
      ) : (
        <div className='text-[#031F68]'>Please Connect your wallet!</div>
      )}
    </>
  );
};

export default InfiniteScrollWrapper;
