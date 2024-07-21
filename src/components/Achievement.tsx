import { useEffect, useState } from 'react';
import CustomButton from './custom/CustomButton';
import useMounted from '@/hook/useMounted';
import { claimBling, getRewardProcess } from '@/fetching/client/game';
import { toastError, toastSuccess } from '@/utils/toast';
import { useAccount, useProvider } from '@starknet-react/core';
import { CallData } from 'starknet';
import { useStore } from '@/context/store';
import IconInfo from '@/assets/icons/IconInfo';
import IconLoading from '@/assets/icons/IconLoading';

const Achievement = ({ userPoints, tbaLoginData, accessToken }: any) => {
  const { isMounted } = useMounted();
  const [currentRewardPoint, setCurrentRewardPoint] = useState();
  const { account, address } = useAccount();
  const { provider } = useProvider();
  const { getBlingOfTba, setShowModalWaitTransaction } = useStore();
  const [loadingClaim, setLoadingClaim] = useState(false);

  const fetchRewardProcess = async () => {
    const res: any = await getRewardProcess(
      tbaLoginData?.tba_address,
      accessToken
    );
    setCurrentRewardPoint(res?.data?.process);
  };

  useEffect(() => {
    if (isMounted && address && accessToken) {
      fetchRewardProcess();
    }
  }, [isMounted, address, accessToken]);

  const handleClaim = async () => {
    if (!address || !tbaLoginData) return;

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
      setShowModalWaitTransaction(true);
      await provider.waitForTransaction(tx?.transaction_hash as any);
      await Promise.allSettled([fetchRewardProcess(), getBlingOfTba()]);
      toastSuccess('Claim success');
    } catch (error) {
      toastError('Claim failed, try reconnect your wallet!');
      console.log(error);
    } finally {
      setLoadingClaim(false);
      setShowModalWaitTransaction(false);
    }
  };

  return (
    <div className='flex flex-col items-center gap-[0.5rem]'>
      {currentRewardPoint !== undefined && userPoints !== undefined ? (
        <>
          <p className='text-[16px] text-[#DCFC36] flex items-center gap-[8px]'>
            <IconInfo />
            {(currentRewardPoint + 1) * 5} Point to get 10 BLING
          </p>
          <div id='claim_bling_btn'>
            <CustomButton
              className='btn-primary w-[136px] mt-[14px]'
              onClick={handleClaim}
              disabled={userPoints < (currentRewardPoint + 1) * 5}
              loading={loadingClaim}
            >
              Claim
            </CustomButton>
          </div>
        </>
      ) : (
        <div>
          <IconLoading fill='white' className='animate-spin' />
        </div>
      )}
    </div>
  );
};

export default Achievement;
