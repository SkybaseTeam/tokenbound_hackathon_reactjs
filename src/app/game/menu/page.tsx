'use client';

import CustomButton from '@/components/custom/CustomButton';
import CustomImage from '@/components/custom/CustomImage';
import ImageSkeleton from '@/components/custom/CustomSkeleton/ImageSkeleton';
import { useStore } from '@/context/store';
import { collectionData } from '@/fetching/client/mint';
import useMounted from '@/hook/useMounted';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useContract, useProvider } from '@starknet-react/core';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import erc721ABI from '@/abi/erc721.json';
import erc20ABI from '@/abi/erc20.json';
import CustomProgress from '@/components/custom/CustomProgress';
import { cairo, CallData, selector } from 'starknet';
import TbaProfile from '@/components/TbaProfile';

const Menu = () => {
  const router = useRouter();
  const { isConnected, account, address } = useAccount();
  const { connectWallet, getDcoin, accessToken, tbaLoginData } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const { isMounted } = useMounted();
  const [remainingPool, setRemainingPool] = useState<any>(0);

  const MINT_PRICE = 100;

  const TOTAL_POOL_MINT = 1000000000000000000000;

  const { contract: erc20Contract } = useContract({
    abi: erc20ABI,
    address: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS,
  });

  const { contract: erc721Contract } = useContract({
    abi: erc721ABI,
    address: process.env.NEXT_PUBLIC_ERC721_ITEM,
  });

  const getRemainingPool = async () => {
    const remainingPool = await erc721Contract?.get_remaining_mint(1);
    // console.log('here', Number(remainingPool));
    setRemainingPool(remainingPool);
  };

  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }

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
      // Approve Bling from 6551 to ERC721
      const allowance = await erc20Contract?.allowance(
        tbaLoginData?.tba_address,
        process.env.NEXT_PUBLIC_ERC721_ITEM as string
      );
      const isNeedToApprove = Number(allowance) < MINT_PRICE; /*  * 10 ** 18 */

      // Execute Mint: Wallet -> 6551 -> ERC721
      const tx: any = await account?.execute({
        contractAddress: tbaLoginData?.tba_address,
        entrypoint: '__execute__',
        calldata: CallData.compile({
          calls: [
            {
              to: process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
              selector: 'approve',
              calldata: [
                process.env.NEXT_PUBLIC_ERC721_ITEM as string,
                cairo.uint256(MINT_PRICE /*  * 10 ** 18 */),
              ],
            },
            // {},
          ],
        }),
      });
      await provider.waitForTransaction(tx.transaction_hash);
      // const tx = await account?.execute([
      //   ...(!isNeedToApprove
      //     ? []
      //     : [
      //         {
      //           contractAddress: process.env
      //             .NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
      //           entrypoint: 'approve',
      //           calldata: CallData.compile({
      //             spender: process.env.NEXT_PUBLIC_ERC721_ITEM as string,
      //             amount: cairo.uint256(MINT_PRICE /*  * 10 ** 18 */),
      //           }),
      //         },
      //       ]),
      //   {
      //     contractAddress: process.env
      //       .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
      //     entrypoint: 'mint_nft',
      //     calldata: CallData.compile({}),
      //   },
      // ]);

      // toastSuccess('Mint success');
      // getDcoin();
      // getRemainingPool();
    } catch (err) {
      console.log(err);
      toastError('Mint failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='layout-container py-[8rem] flex flex-col items-center'>
      <TbaProfile />

      <CustomButton
        onClick={() => {
          router.push('/game/menu/play');
        }}
        className='btn-primary w-[183px] animate-bounce mt-[5rem] sm:mt-[10rem]'
      >
        Play Now
      </CustomButton>

      <div className='bg-white rounded-[32px] pt-[86px] pb-[110px] text-[#031F68] w-full mt-[10rem]'>
        <div className='layout-container flex flex-col items-center'>
          <h2 className='text-[48px] font-[500] font-glancyr max-sm:text-center '>
            Mint the Item for your Token-Bound Account
          </h2>
          <p className='max-sm:text-center'>
            (This will increase your Token-Bound Account Power)
          </p>
          <div className=' w-full mt-[63px]'>
            <div className='flex justify-center items-center gap-[56px] max-sm:flex-col'>
              <div className='p-[16px] rounded-2xl bg-[#E6EBF8] w-[484px] max-sm:w-full '>
                <div className='aspect-square relative rounded-2xl'>
                  <CustomImage
                    src='https://cryptowalkers.mypinata.cloud/ipfs/QmdXKK6JJgX1bw1J974coE6i9GFDpMUZ7jyNiUvxqa31sN/smg_custom.png'
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
                  Bling Token-Bound Item
                </h1>
                <div className='flex items-center font-glancyr text-[16px] font-[300] text-[#546678] mb-[2px] justify-between'>
                  <p>Minted Item</p>
                  <p>
                    {remainingPool
                      ? TOTAL_POOL_MINT - Number(remainingPool)
                      : 0}
                    /{TOTAL_POOL_MINT}
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
                  <p className='text-[30px] font-[400] text-[#031F68]'>
                    100 BLING
                  </p>
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
      </div>
    </div>
  );
};

export default Menu;
