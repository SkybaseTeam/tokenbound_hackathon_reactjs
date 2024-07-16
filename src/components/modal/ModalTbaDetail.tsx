import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import IconVerified from '@/assets/icons/IconVerified';
import CustomButton from '../custom/CustomButton';
import { useAccount, useProvider } from '@starknet-react/core';
import { formatWallet } from '@/utils';
import CustomTooltip from '../custom/CustomTooltip';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { fetchNft } from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import ImageSkeleton from '../custom/CustomSkeleton/ImageSkeleton';
import useResponsive from '@/hook/useResponsive';
import IconCopy from '@/assets/icons/IconCopy';
import IconCopyTba from '@/assets/icons/IconCopyTba';
import NftSkeleton from '../custom/CustomSkeleton/NftSkeleton';
import { Skeleton } from 'antd';

const ModalTbaDetail = ({
  open,
  onCancel,
  selectedNFT,
  setOpenModalBuyNTF,
  showBuy = true,
}: any) => {
  const [text, copy] = useCopyToClipboard();
  const [nftItemList, setNftItemList] = useState<any>();
  const { isMounted } = useMounted();
  const [height, setHeight] = useState('auto');
  const windowSize = useResponsive();
  const { address } = useAccount();

  useEffect(() => {
    const getNftItemList = async () => {
      const res = await fetchNft(selectedNFT?.tba_address);
      setNftItemList(res?.data?.data);
    };
    if (isMounted && selectedNFT?.tba_address && open) {
      getNftItemList();
    }
  }, [isMounted, selectedNFT, open]);

  useEffect(() => {
    if (!open) {
      setNftItemList(undefined);
    }
  }, [open]);

  useEffect(() => {
    if (nftItemList) {
      const handleResize = () => {
        const element = document.getElementById('tba_info_img');
        const h: any = element?.offsetHeight;
        setHeight(h);
      };

      handleResize();

      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    }
  }, [nftItemList]);

  return (
    <CustomModal width={1205} open={open} onCancel={onCancel}>
      <div className='max-sm:pt-[1rem] max-lg:!pr-0 sm:p-[24px] p-[12px] font-glancyr text-[#031F68] '>
        <div className='max-lg:max-h-[80vh] max-lg:overflow-auto rounded-2xl pr-[1rem]'>
          <h2 className='text-[48px] font-[500] text-[#031F68]'>
            {selectedNFT?.tba_name}
          </h2>
          <div className='mt-[20px] flex items-start gap-[40px] max-lg:flex-col'>
            <div
              id='tba_info_img'
              className='lg:basis-1/2 w-full relative aspect-square'
            >
              <CustomImage
                src={selectedNFT?.tba_image}
                fill
                alt='err'
                className='rounded-2xl'
              />
            </div>

            <div
              className='lg:basis-1/2 w-full lg:overflow-y-auto'
              style={{
                height: windowSize?.width >= 1024 ? height : 'auto',
              }}
            >
              <div className='grid sm:grid-cols-2 gap-[2rem] sm:gap-[5rem]'>
                <div className='text-[18px] font-[300] text-[#546678]'>
                  Token-Bound Address
                  <div className='flex items-center gap-[0.5rem]'>
                    <p className='mt-[8px] font-[400] text-[24px] text-[#031F68]'>
                      {formatWallet(selectedNFT?.tba_address)}
                    </p>
                    <CustomTooltip
                      title='Copied Address'
                      placement='right'
                      trigger={['click']}
                    >
                      <div
                        className='cursor-pointer'
                        onClick={() => copy(selectedNFT?.tba_address as string)}
                      >
                        <IconCopyTba />
                      </div>
                    </CustomTooltip>
                  </div>
                </div>
                <div className='text-[18px] font-[300] text-[#546678]'>
                  Owner
                  <div className='flex items-center gap-[0.5rem]'>
                    <p className='mt-[8px] font-[400] text-[24px] text-[#031F68]'>
                      {formatWallet(selectedNFT?.owner_address)}
                    </p>
                    <CustomTooltip
                      title='Copied Address'
                      placement='right'
                      trigger={['click']}
                    >
                      <div
                        className='cursor-pointer'
                        onClick={() =>
                          copy(selectedNFT?.owner_address as string)
                        }
                      >
                        <IconCopyTba />
                      </div>
                    </CustomTooltip>
                  </div>
                </div>
              </div>

              {showBuy && (
                <div className='p-[16px] rounded-2xl bg-[#0538BD] max-extra-sm:flex-col max-extra-sm:items-start flex items-end justify-between  mt-[24px]'>
                  <div className=''>
                    <p className='text-[18px] font-[300] text-white'>Price</p>
                    <p className='mt-[8px] text-[32px] font-[400] text-[#DCFC36]'>
                      {selectedNFT?.price} BLING
                    </p>
                  </div>
                  <CustomButton
                    onClick={() => {
                      setOpenModalBuyNTF(true);
                    }}
                    className='btn-primary w-[181px] max-extra-sm:mt-[1rem]'
                  >
                    Buy Now
                  </CustomButton>
                </div>
              )}

              <div className='mt-[40px]'>
                <p className='text-[24px] text-[#546678]'>Items</p>
                <div className='grid gap-[16px] mt-[16px] '>
                  {nftItemList !== undefined ? (
                    nftItemList?.length > 0 ? (
                      nftItemList?.map((item: any, index: any) => (
                        <a
                          href={`${process.env.NEXT_PUBLIC_STARKSCAN_URL + '/nft/' + item?.collection_address + '/' + item?.token_id}`}
                          target='_blank'
                          className='bg-[#F4FEC1] p-[8px] hover:bg-[#e9fc8c] transition-all rounded-2xl flex items-center gap-[12px] cursor-pointer '
                          key={item?._id}
                        >
                          {item?.nft_image ? (
                            <CustomImage
                              src={item?.nft_image}
                              width={80}
                              height={80}
                              className='rounded-xl'
                              alt='err'
                            />
                          ) : (
                            <ImageSkeleton />
                          )}

                          <div className='overflow-hidden'>
                            <p className='text-[18px] font-[300] text-[#546678]'>
                              NFT
                            </p>
                            <p className='mt-[8px] text-[24px] font-[400] text-[#0538BD] truncate '>
                              {item?.nft_name}
                            </p>
                          </div>
                        </a>
                      ))
                    ) : (
                      <div className='text-[#031F68]'>No Data!</div>
                    )
                  ) : (
                    <div className='grid gap-[20px]'>
                      {[...new Array(4)].map((_, index) => (
                        <div
                          key={index}
                          className='w-full rounded-lg flex items-center gap-[1rem]'
                        >
                          <Skeleton.Button
                            shape='square'
                            active
                            className='aspect-square !w-[5rem] rounded-lg skeleton-image'
                            block
                          />
                          <div className='mt-2 space-y-2 w-full'>
                            <div className='w-full'>
                              <Skeleton.Button size='small' active block />
                            </div>
                            <div className='w-4/6'>
                              <Skeleton.Button size='small' active block />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalTbaDetail;
