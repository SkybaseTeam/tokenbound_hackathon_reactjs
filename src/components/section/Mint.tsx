'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import CustomProgress from '@/components/custom/CustomProgress';
import { useStore } from '@/context/store';
import useMounted from '@/hook/useMounted';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useContract, useProvider } from '@starknet-react/core';
import { useEffect, useState } from 'react';
import { CallData } from 'starknet';
import erc721ABI from '@/abi/erc721.json';
import { refreshMintStatus } from '@/fetching/client/mint';
import ModalMintTbaSuccess from '../modal/ModalMintTbaSuccess';
import { profile } from '@/fetching/client/profile';

export default function Mint() {
  const { isConnected, account, address } = useAccount();
  const { connectWallet, setShowModalWaitTransaction } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const { isMounted } = useMounted();
  const [remainingPool, setRemainingPool] = useState<any>(0);
  const TOTAL_POOL_MINT = 1000;
  const [showModalMintTbaSuccess, setShowModalMintTbaSuccess] = useState(false);
  const [mintedNft, setMintedNft] = useState<any>();

  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS,
  });

  const getRemainingPool = async () => {
    const remainingPool = await erc721Contract?.get_remaining_mint(1);
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
            .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
          entrypoint: 'mint_nft',
          calldata: CallData.compile({
            registry_contract: process.env
              .NEXT_PUBLIC_REGISTRY_CONTRACT_ADDRESS as string,
            implementation_hash: process.env
              .NEXT_PUBLIC_ACCOUNT_CLASSHASH as string,
          }),
        },
      ]);

      setShowModalWaitTransaction(true);
      const data: any = await provider.waitForTransaction(
        tx?.transaction_hash as any
      );
      const tokenId = parseInt(data?.events[3]?.data[2], 16);
      console.log('TokenId', tokenId);
      await Promise.allSettled([
        refreshMintStatus({
          token_id: tokenId,
          owner_address: address,
          collection_address: process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS,
        }),
        // getDcoin(),
        getRemainingPool(),
      ]);

      const res: any = await profile(address?.toLocaleLowerCase());
      setMintedNft(
        res?.data?.data?.find((item: any) => item?.token_id === tokenId)
      );
      setShowModalMintTbaSuccess(true);
    } catch (err) {
      console.log(err);
      toastError('Mint failed');
    } finally {
      setLoading(false);
      setShowModalWaitTransaction(false);
    }
  };

  return (
    <section
      id='mint_section'
      className='bg-white rounded-[32px] pt-[86px] pb-[110px] text-[#031F68] '
    >
      <ModalMintTbaSuccess
        open={showModalMintTbaSuccess}
        onCancel={() => {
          setShowModalMintTbaSuccess(false);
        }}
        mintedNft={mintedNft}
      />
      <div className='layout-container flex flex-col items-center'>
        <h2 className='text-[48px] font-[500] font-glancyr max-sm:text-center'>
          Mint your first Token-bound account and play game!
        </h2>
        <div className=' w-full mt-[63px]'>
          <div className='flex justify-center items-center gap-[56px] max-sm:flex-col'>
            <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[484px] max-sm:w-full '>
              <div className='aspect-square relative rounded-2xl'>
                <CustomImage
                  src='https://i.seadn.io/s/raw/files/af7296d9d79348b19bfdb151f5698cb7.gif?auto=format&dpr=1&w=1000'
                  className='rounded-2xl'
                  alt='err'
                  fill
                />
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
                ERC-6551 Token-bound Account
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
