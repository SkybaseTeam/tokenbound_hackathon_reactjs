'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import CustomProgress from '@/components/custom/CustomProgress';
import { useStore } from '@/context/store';
import { collectionData } from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useContract, useProvider } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { cairo, CallData } from 'starknet';
import erc721ABI from '@/abi/erc721.json';
import erc20ABI from '@/abi/erc20.json';
import ImageSkeleton from '../custom/CustomSkeleton/ImageSkeleton';

export default function Mint() {
  const router = useRouter();
  const { isConnected, account, address } = useAccount();
  const { connectWallet, getDcoin } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const [collection, setCollection] = useState<any>([]);
  const { isMounted } = useMounted();
  const [remainingPool, setRemainingPool] = useState<any>(0);

  useEffect(() => {
    if (!isMounted) return;

    const getHomeData = async () => {
      try {
        const collectionResponse: any = await collectionData();

        const collectionResponseData = collectionResponse?.data?.data;
        setCollection(collectionResponseData[0]);
      } catch (err) {
        toastError('Get Collection Data failed');
        console.log(err);
      }
    };

    getHomeData();
  }, [isMounted]);

  const MINT_PRICE = collection?.mint_price;

  const TOTAL_POOL_MINT = 100;

  const { contract: erc20Contract } = useContract({
    abi: erc20ABI,
    address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS,
  });

  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS,
  });

  const getRemainingPool = async () => {
    const remainingPool = await erc721Contract?.get_remaining_mint(1);
    // console.log('here', Number(remainingPool));
    setRemainingPool(remainingPool);
  };

  useEffect(() => {
    getRemainingPool();
    const interval = setInterval(() => {
      getRemainingPool();
    }, 180000);
    return () => clearInterval(interval);
  }, []);

  const onMint = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const tx = await account?.execute([
        {
          contractAddress: process.env
            .NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS as string,
          entrypoint: 'create_account',
          calldata: CallData.compile({
            implementation_hash: process.env
              .NEXT_PUBLIC_ACCOUNT_CLASSHASH as string,
            token_contract: process.env
              .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
            salt: 123,
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      toastSuccess('Mint success');
      getDcoin();
      getRemainingPool();
      console.log('tx hash', tx);
    } catch (err) {
      console.log(err);
      toastError('Mint failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="mint_section" className='bg-white rounded-[32px] pt-[86px] pb-[110px] text-[#031F68] '>
      <div className='layout-container flex flex-col items-center'>
        <h2 className='text-[48px] font-[500] font-glancyr'>
          ERC-6551 Token-bound Account
        </h2>
        <div className=' w-full mt-[63px]'>
          <div className='flex justify-center items-center gap-[56px] max-sm:flex-col'>
            <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[484px] max-sm:w-full '>
              <div className='aspect-square relative rounded-2xl'>
                {collection?.image ? (
                  <CustomImage
                    src={collection?.image}
                    className='rounded-2xl'
                    alt='err'
                    fill
                  />
                ) : (
                  <ImageSkeleton />
                )}
              </div>
            </div>
            <div className='w-[566px] max-sm:w-full flex flex-col'>
              <CustomImage
                src='/images/mint/like.webp'
                width={133}
                height={44}
                alt='err'
              />
              <h1 className='text-[30px] font-[400] font-glancyr my-[21px]'>
                Mint your first Token-bound account and play game!
              </h1>
              <div className='flex items-center font-glancyr text-[16px] font-[300] text-[#546678] mb-[2px] justify-between'>
                <p>Minted Item</p>
                <p>
                  {remainingPool ? TOTAL_POOL_MINT - Number(remainingPool) : 0}/
                  {TOTAL_POOL_MINT}
                </p>
              </div>
              <CustomProgress
                showInfo={false}
                percent={
                  remainingPool
                    ? ((TOTAL_POOL_MINT - Number(remainingPool)) /
                        TOTAL_POOL_MINT) *
                      100
                    : 0
                }
              />
              <div className='flex items-center gap-[20px] my-[20px] font-glancyr'>
                <p className='text-[16px] font-[300] text-[#546678]'>Price</p>
                <p className='text-[30px] font-[400] text-[#031F68]'>Free</p>
              </div>
              <div className='flex justify-end'>
                {' '}
                <CustomButton
                  loading={loading}
                  onClick={onMint}
                  className='btn-primary w-[266px]'
                >
                  Mint
                </CustomButton>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
