import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import CustomButton from '../custom/CustomButton';
import { useAccount, useProvider } from '@starknet-react/core';
import { useStore } from '@/context/store';
import { toastError, toastSuccess } from '@/utils/toast';
import { cairo, Contract } from 'starknet';
import { listedNFT, refreshListing } from '@/fetching/client/home';
import { usePathname } from 'next/navigation';
import { formatWallet } from '@/utils';
import CustomTooltip from '../custom/CustomTooltip';
import useCopyToClipboard from '@/hook/useCopyToClipboard';

const ModalCancelListNFT = ({ open, onCancel, data, getUserTbaList }: any) => {
  const { isConnected, account, address } = useAccount();
  const { connectWallet, setListedNFTData, setShowModalWaitTransaction } =
    useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const path = usePathname();
  const [text, copy] = useCopyToClipboard();

  const TOKEN_ID = data?.token_id;

  const onUnList = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const { abi } = await provider.getClassAt(
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string
      );
      const marketContract = new Contract(
        abi,
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
        provider
      );
      marketContract.connect(account as any);
      const tx = await marketContract.cancel_nft(
        process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
        TOKEN_ID
      );
      setShowModalWaitTransaction(true);
      await provider.waitForTransaction(tx?.transaction_hash as any);
      await refreshListing({
        token_id: TOKEN_ID,
        collection_address: data?.collection_address,
      });
      path.includes('/profile') && (await getUserTbaList());
      if (path === '/market') {
        const newListedNfts = await listedNFT();
        setListedNFTData(newListedNfts?.data?.data);
      }
      toastSuccess('Cancel List success');
      onCancel();
    } catch (err) {
      console.log(err);
      toastError('Cancel List failed');
    } finally {
      setLoading(false);
      setShowModalWaitTransaction(false);
    }
  };

  return (
    <CustomModal width={450} open={open} onCancel={onCancel}>
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68]'>
        <h4 className='text-[48px] font-[500] text-[#031F68] text-center'>
          Cancel List
        </h4>

        <div className='overflow-y-auto scrollbar-custom mt-[30px]'>
          <div className='text-white flex justify-between items-center gap-[24px]'>
            <CustomImage
              src={data?.tba_image}
              alt='nft'
              width={100}
              height={100}
              className='rounded-2xl'
            />
            <div className='flex-1 flex flex-col justify-between truncate '>
              <span className='truncate text-[24px] text-[#031F68] font-[400]'>
                {data?.tba_name}
              </span>
              <p className='text-[16px] font-[300] text-[#546678]'>
                Address
                <CustomTooltip
                  title='Copied'
                  placement='right'
                  trigger={['click']}
                >
                  <span
                    onClick={() => copy(data?.owner_address as string)}
                    className='text-[#031F68] text-[18px] font-[400] ml-[0.5rem] cursor-pointer'
                  >
                    {formatWallet(data?.tba_address)}
                  </span>
                </CustomTooltip>
              </p>
            </div>
          </div>
        </div>
        <div className='mt-[40px]'>
          <CustomButton
            onClick={onUnList}
            className='btn-primary w-full'
            loading={loading}
          >
            Cancel List
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalCancelListNFT;
