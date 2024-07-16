import { useEffect, useState } from 'react';
import CustomButton from './custom/CustomButton';
import useMounted from '@/hook/useMounted';
import { claimBling, getRewardProcess } from '@/fetching/client/game';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useProvider } from '@starknet-react/core';
import { CallData } from 'starknet';
import { useStore } from '@/context/store';

const Achievement = ({ userPoints, tbaLoginData, accessToken }: any) => {
  const { isMounted } = useMounted();
  const [currentRewardPoint, setCurrentRewardPoint] = useState(0);
  const { account } = useAccount();
  const { provider } = useProvider();
  const { getBlingOfTba } = useStore();
  const [loadingClaim, setLoadingClaim] = useState(false);
  const { address } = useAccount();

  const fetchRewardProcess = async () => {
    const res: any = await getRewardProcess(
      tbaLoginData?.tba_address,
      accessToken
    );
    setCurrentRewardPoint(res?.data?.process);
  };

  useEffect(() => {
    if (!isMounted || !address) return;
    fetchRewardProcess();
  }, [isMounted, address]);

  const handleClaim = async () => {
    setLoadingClaim(true);
    try {
      // get signature from server
      const res = await claimBling(tbaLoginData?.tba_address, accessToken);

      // mint BLING
      const tx = await account?.execute([
        {
          contractAddress: tbaLoginData?.tba_address,
          entrypoint: 'claim_token',
          calldata: CallData.compile({
            token_contract: process.env
              .NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
            message_hash: res?.data?.message_hash,
            signature_r: res?.data?.signature.r,
            signature_s: res?.data?.signature.s,
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      await Promise.allSettled([fetchRewardProcess(), getBlingOfTba()]);
      toastSuccess('Claim success');
    } catch (error) {
      toastError('Claim failed');
      console.log(error);
    } finally {
      setLoadingClaim(false);
    }
  };

  return (
    <div className='flex flex-col items-center gap-[0.5rem]'>
      <p className='font-[500] text-[28px] sm:text-[48px]'>
        <span className='text-white'>{(currentRewardPoint + 1) * 5} Point</span>{' '}
        <span className='text-[18px] sm:text-[30px] text-[#B2C1EB] sm:px-[30px]'>
          to get
        </span>{' '}
        <span className='text-[#DCFC36]'>10 BLING</span>
      </p>
      <div id='claim_bling_btn'>
        <CustomButton
          className='btn-primary w-[136px]'
          onClick={handleClaim}
          disabled={userPoints < (currentRewardPoint + 1) * 5}
          loading={loadingClaim}
        >
          Claim
        </CustomButton>
      </div>
    </div>
  );
};

export default Achievement;
