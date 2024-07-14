import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import CustomButton from '../custom/CustomButton';
import { useAccount, useProvider } from '@starknet-react/core';
import { useStore } from '@/context/store';
import { toastError, toastSuccess } from '@/utils/toast';
import { Contract } from 'starknet';
import { refreshListing } from '@/fetching/client/home';
import { usePathname } from 'next/navigation';

const ModalCancelListNFT = ({ open, onCancel, data, getProfile }: any) => {
  const { isConnected, account, address } = useAccount();
  const { connectWallet } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);
  const path = usePathname();

  const TOKEN_ID = data?.tokenId;

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
      await provider.waitForTransaction(tx?.transaction_hash as any);
      await refreshListing({ tokenId: TOKEN_ID });
      /*  path.includes('/profile') && */ await getProfile();
      // if (path === '/') {
      //   const newListedNfts = await listedNFT();
      //   setListedNFTData(newListedNfts?.data?.data);
      // }
      toastSuccess('Cancel List success');
      onCancel();
    } catch (err) {
      console.log(err);
      toastError('Cancel List failed');
    } finally {
      setLoading(false);
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
              src={data?.image}
              alt='nft'
              width={100}
              height={100}
              className='rounded-2xl'
            />
            <div className='flex-1 flex flex-col justify-between truncate '>
              <span className='truncate text-[24px] text-[#031F68] font-[400]'>
                {data?.name}
              </span>
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
