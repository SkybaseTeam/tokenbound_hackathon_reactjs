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

const ModalTbaDetail = ({
  open,
  onCancel,
  selectedNFT,
  setOpenModalBuyNTF,
  showBuy = true,
}: any) => {
  const [text, copy] = useCopyToClipboard();
  const [nftItemList, setNftItemList] = useState<any>([]);
  const { isMounted } = useMounted();
  const [height, setHeight] = useState(0);
  const windowSize = useResponsive();

  console.log(windowSize);

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
    const handleResize = () => {
      const element = document.getElementById('tba_info_img');
      const h = element ? element.offsetHeight : 0;
      setHeight(h);
    };

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <CustomModal width={1205} open={open} onCancel={onCancel}>
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68] max-lg:max-h-[80vh] max-lg:overflow-auto max-sm:py-[2rem]'>
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
            <div className='grid grid-cols-2 gap-[5rem]'>
              <div className='text-[18px] font-[300] text-[#546678]'>
                Token-Bound Address
                <CustomTooltip
                  title='Copied Address'
                  placement='right'
                  trigger={['click']}
                >
                  <p
                    onClick={() => copy(selectedNFT?.tba_address as string)}
                    className='mt-[8px] font-[400] text-[24px] text-[#031F68] cursor-pointer'
                  >
                    {formatWallet(selectedNFT?.tba_address)}
                  </p>
                </CustomTooltip>
              </div>
              <div className='text-[18px] font-[300] text-[#546678]'>
                Owner
                <CustomTooltip
                  title='Copied Address'
                  placement='right'
                  trigger={['click']}
                >
                  <p
                    onClick={() => copy(selectedNFT?.owner_address as string)}
                    className='mt-[8px] font-[400] text-[24px] text-[#031F68] cursor-pointer'
                  >
                    {formatWallet(selectedNFT?.owner_address)}
                  </p>{' '}
                </CustomTooltip>
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
              <div className='grid gap-[16px] sm:grid-cols-2 mt-[16px] overflow-y-auto'>
                {nftItemList?.map((item: any) => (
                  <a
                    href={`${process.env.NEXT_PUBLIC_STARKSCAN_URL + '/nft/' + item?.collection_address + '/' + item?.token_id}`}
                    target='_blank'
                    className='bg-[#F4FEC1] p-[16px]  rounded-2xl flex items-center gap-[12px] cursor-pointer hover:translate-y-[-0.5rem] transition-all'
                    key={item?._id}
                  >
                    {item?.nft_image ? (
                      <CustomImage
                        src={item?.nft_image}
                        width={68}
                        height={68}
                        className='rounded-2xl'
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
                ))}
                {nftItemList?.map((item: any) => (
                  <a
                    href={`${process.env.NEXT_PUBLIC_STARKSCAN_URL + '/nft/' + item?.collection_address + '/' + item?.token_id}`}
                    target='_blank'
                    className='bg-[#F4FEC1] p-[16px]  rounded-2xl flex items-center gap-[12px] cursor-pointer hover:translate-y-[-0.5rem] transition-all'
                    key={item?._id}
                  >
                    {item?.nft_image ? (
                      <CustomImage
                        src={item?.nft_image}
                        width={68}
                        height={68}
                        className='rounded-2xl'
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
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalTbaDetail;
