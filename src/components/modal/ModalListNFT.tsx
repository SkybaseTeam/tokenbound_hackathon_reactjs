import React, { useEffect, useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import CustomButton from '../custom/CustomButton';
import CustomInput from '../custom/CustomInput';
import { useAccount, useProvider } from '@starknet-react/core';
import { useStore } from '@/context/store';
import { toastError, toastSuccess } from '@/utils/toast';
import { CallData, Contract, cairo } from 'starknet';
import { refreshListing } from '@/fetching/client/home';

const ModalListNFT = ({ open, onCancel, data, getProfile }: any) => {
  const [price, setPrice] = useState('');

  const { isConnected, account, address } = useAccount();
  const { connectWallet } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setPrice('');
  }, [open]);

  const TOKEN_ID = data?.token_id;

  const onList = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const { abi } = await provider.getClassAt(
        process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string
      );

      const erc721Contract = new Contract(
        abi,
        process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
        provider
      );

      const approveStatus = await erc721Contract.getApproved(TOKEN_ID);
      const isNeedToApprove = Number(approveStatus) === 0;

      const tx = await account?.execute([
        ...(!isNeedToApprove
          ? []
          : [
              {
                contractAddress: process.env
                  .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
                entrypoint: 'approve',
                calldata: CallData.compile({
                  to: process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
                  token_id: cairo.uint256(TOKEN_ID),
                }),
              },
            ]),
        {
          contractAddress: process.env
            .NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
          entrypoint: 'listing_nft',
          calldata: CallData.compile({
            token_address: process.env
              .NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS as string,
            token_id: cairo.uint256(TOKEN_ID),
            price: cairo.uint256(Number(price) * 10 ** 18),
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      await refreshListing({
        token_id: TOKEN_ID,
        collection_address: process.env.NEXT_PUBLIC_ERC721_CONTRACT_ADDRESS,
      });
      await getProfile(address);
      toastSuccess('List for sale success');
      onCancel();
    } catch (err) {
      console.log(err);
      toastError('List for sale failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal width={435} open={open} onCancel={onCancel}>
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68]'>
        <h4 className='text-[48px] font-[500] text-[#031F68] text-center'>
          List for Sale
        </h4>

        <div className='overflow-y-auto scrollbar-custom mt-[25px]'>
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
                {data?.tba_name || "NFT's Name"}
              </span>
            </div>
          </div>

          <div className='mt-[24px] flex items-center gap-[12px]'>
            <CustomInput
              placeholder='Enter the price'
              pattern='^\d*\.?\d*$'
              value={price}
              onChange={(e: any) => {
                if (!e.target.value) setPrice('');
                if (e.target.value && e.target.validity.valid)
                  setPrice(e.target.value);
              }}
            />
            <p className='text-[18px] text-[#0538BD]'> .BLING</p>
          </div>

          <div className='flex items-center text-[16px] justify-between text-[#031F68] mt-[40px]'>
            <span className='text-[#546678] font-[300]'>Fee</span>
            <div className='space-x-1 flex items-center font-medium text-base'>
              0 BLING
            </div>
          </div>
          <div className='flex items-center text-[16px] justify-between text-[#031F68] mt-[10px]'>
            <span className='text-[#546678] font-[300]'>
              Creator Royalties (0%)
            </span>
            <div className='space-x-1 flex items-center font-medium text-base'>
              0 BLING
            </div>
          </div>
          <div className='flex items-center text-[16px] justify-between text-[#031F68] mt-[10px]'>
            <span className='text-[#546678] font-[300]'>Platform (0%)</span>
            <div className='space-x-1 flex items-center font-medium text-base'>
              0 BLING
            </div>
          </div>
        </div>

        <div className='flex items-center mt-5 gap-[1rem]'>
          <CustomButton
            disabled={price === ''}
            loading={loading}
            onClick={onList}
            className='btn-primary w-full'
          >
            List Now
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalListNFT;
