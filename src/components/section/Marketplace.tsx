import React, { useEffect, useState } from 'react';
import CustomImage from '../custom/CustomImage';
import CustomButton from '../custom/CustomButton';
import CardMarketplace from '../CardMarketplace';
import NftSkeleton from '../custom/CustomSkeleton/NftSkeleton';
import Link from 'next/link';
import { useStore } from '@/context/store';
import useMounted from '@/hook/useMounted';
import { toastError } from '@/utils/toast';
import { fetchListedTba } from '@/fetching/client/tba';
import { useAccount } from '@starknet-react/core';

const Marketplace = () => {
  const [openModalBuyNTF, setOpenModalBuyNTF] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [listedTba, setListedTba] = useState<any>();
  const { isMounted } = useMounted();

  const LIMIT = 4;

  useEffect(() => {
    if (!isMounted) return;
    getListedTba();
  }, [isMounted]);

  const getListedTba = async () => {
    try {
      window.scrollTo(0, 0);
      fetchListedTba({ page: 1, limit: LIMIT, listing: true }).then((res) => {
        setListedTba(res?.data?.data);
      });
    } catch (err) {
      toastError('Get listed tba failed');
      console.log(err);
    }
  };

  return (
    <section
      id='market_section'
      className='pt-[8rem] pb-[185px] px-[32px] max-sm:px-[16px]'
    >
      <div className='max-w-[1260px] mx-auto'>
        <div className='flex items-center flex-col'>
          <CustomImage
            src='/images/marketplace/arrow.webp'
            alt='err'
            className='animate-bounce'
            width={88}
            height={110}
          />
          <h2 className='text-[48px] font-[400]'>Marketplace</h2>
          <p className='my-[20px] font-[300]'>
            Find rare and exciting Tokenbound assets on the Marketplace, your
            one-stop shop for buying and selling.
          </p>
          <Link href='/market'>
            <CustomButton className='btn-primary w-[143px]'>
              View More
            </CustomButton>
          </Link>

          <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-[1rem] mt-[52px]  w-full'>
            {listedTba?.length !== undefined
              ? listedTba?.map((item: any, index: any) => (
                  <Link href={'/market'} key={index}>
                    <CardMarketplace
                      data={item}
                      setOpenModalBuyNTF={setOpenModalBuyNTF}
                      setSelectedNFT={setSelectedNFT}
                      /*   data-aos='fade-right'
                      data-aos-delay={(index + 1) * 200} */
                    />
                  </Link>
                ))
              : listedTba
                  ?.slice(0, 4)
                  ?.map((item: any, index: any) => <NftSkeleton key={index} />)}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Marketplace;
