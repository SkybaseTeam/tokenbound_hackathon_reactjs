import React, { useEffect, useState } from 'react';
import CustomImage from './custom/CustomImage';
import CustomTooltip from './custom/CustomTooltip';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { formatDecimal, formatWallet } from '@/utils';
import IconLogout from '@/assets/icons/IconLogout';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store';
import useMounted from '@/hook/useMounted';
import erc20abi from '@/abi/erc20.json';
import { CallData, Contract } from 'starknet';
import { useAccount, useProvider } from '@starknet-react/core';
import CustomButton from './custom/CustomButton';
import { toastError, toastSuccess } from '@/utils/toast';
import IconCopy from '@/assets/icons/IconCopy';

const TbaProfile = () => {
  const [text, copy] = useCopyToClipboard();
  const router = useRouter();
  const {
    point,
    tbaLoginData,
    setPoint,
    getBlingOfTba,
    blingTba,
    getDcoin,
    getGameProfile,
  } = useStore();
  const { provider } = useProvider();
  const [loadingWithDraw, setLoadingWithDraw] = useState(false);
  const { account } = useAccount();
  const { setShowModalWaitTransaction, setAccessToken, accessToken } =
    useStore();
  const { isMounted } = useMounted();
  useEffect(() => {
    setPoint(tbaLoginData?.point);
  }, []);

  useEffect(() => {
    isMounted && accessToken && getGameProfile();
  }, [isMounted, accessToken]);

  useEffect(() => {
    if (isMounted && tbaLoginData?.tba_address) {
      getBlingOfTba();
    }
  }, [isMounted, tbaLoginData?.tba_address]);

  const onWithDraw = async () => {
    setLoadingWithDraw(true);
    try {
      // mint BLING
      const tx = await account?.execute([
        {
          contractAddress: tbaLoginData?.tba_address,
          entrypoint: 'withdraw',
          calldata: CallData.compile({
            token_contract: process.env
              .NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
          }),
        },
      ]);
      setShowModalWaitTransaction(true);
      await provider.waitForTransaction(tx?.transaction_hash as any);
      await Promise.allSettled([getDcoin(), getBlingOfTba()]);
      toastSuccess('WithDraw success');
    } catch (error) {
      toastError('WithDraw failed');
      console.log(error);
    } finally {
      setLoadingWithDraw(false);
      setShowModalWaitTransaction(false);
    }
  };

  return (
    <div className='mt-[5rem]'>
      <div className='flex items-start rounded-2xl justify-between p-[12px] text-[16px] font-[400] bg-[#3760CA] '>
        <div>
          <div className='flex items-start sm:items-center gap-[12px]'>
            <CustomImage
              src={tbaLoginData?.tba_image}
              width={110}
              height={110}
              alt='err'
              className='rounded-2xl max-sm:w-[60px]'
            />
            <div>
              <p className='text-[18px] max-sm:hidden'>My Tokenbound Account</p>
              <p className='text-[18px] sm:hidden'>My TBA</p>
              <div className='flex items-center gap-[8px] mt-[4px]'>
                <div className=' text-white flex items-center gap-[0.5rem]'>
                  <p
                  // className='mt-[0.3rem]'
                  >
                    {tbaLoginData?.tba_name}
                  </p>
                  <CustomTooltip
                    title='Copied Address'
                    placement='right'
                    trigger={['click']}
                  >
                    <div>
                      <IconCopy
                        className='cursor-pointer'
                        onClick={() =>
                          copy(tbaLoginData?.tba_address as string)
                        }
                      />
                    </div>
                  </CustomTooltip>
                </div>
              </div>

              <div className='flex items-center gap-[12px] max-sm:hidden'>
                <div className='border border-[#DCFC36] text-[16px] font-[400] text-[#DCFC36] px-[12px] h-[36px] rounded-[32px] mt-[8px] inline-block'>
                  <div className=' mt-[0.3rem]'>
                    <p>
                      Points: {formatDecimal(Number(point))}{' '}
                      <span className='px-[0.5rem]'>|</span> Amount:{' '}
                      {blingTba || 0} BLING
                    </p>
                  </div>
                </div>
                <CustomButton
                  loading={loadingWithDraw}
                  className='btn-primary max-sm:hidden'
                  onClick={onWithDraw}
                  disabled={blingTba <= 0}
                >
                  WithDraw
                </CustomButton>
              </div>
            </div>
          </div>

          <div className='flex items-center gap-[12px] mt-[0.3rem] sm:hidden'>
            <div className='text-[16px]  border border-[#DCFC36] font-[400] text-[#DCFC36] px-[12px] py-[6px] rounded-[16px] mt-[8px]'>
              <p className='border-b max-sm:pb-[0.2rem] border-[#DCFC36]'>
                Points: {formatDecimal(Number(point))}
              </p>
              <p className='max-sm:mt-[0.2rem]'>
                Amount: {blingTba || 0} BLING
              </p>
            </div>
            <CustomButton
              loading={loadingWithDraw}
              onClick={onWithDraw}
              className='btn-primary max-sm:!text-[14px] max-sm:px-[10px] max-sm:!h-[45px] max-sm:!rounded-xl'
              disabled={blingTba <= 0}
            >
              WithDraw
            </CustomButton>
          </div>
        </div>

        <IconLogout
          className='cursor-pointer'
          fill='#ef4444'
          onClick={() => {
            router.push('/game');
            setAccessToken(undefined);
            // setTimeout(() => {
            //   window.location.reload();
            // }, 500);
          }}
        />
      </div>
    </div>
  );
};

export default TbaProfile;
