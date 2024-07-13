import React, { useState } from 'react';
import CustomModal from '../custom/CustomModal';
import CustomImage from '../custom/CustomImage';
import IconVerified from '@/assets/icons/IconVerified';
import CustomButton from '../custom/CustomButton';
import { useAccount, useProvider } from '@starknet-react/core';
import { formatWallet } from '@/utils';
import CustomTooltip from '../custom/CustomTooltip';
import IconCopy from '@/assets/icons/IconCopy';
import { useStore } from '@/context/store';
import { CallData, Contract, cairo } from 'starknet';
import { toastError, toastSuccess } from '@/utils/toast';
import useCopyToClipboard from '@/hook/useCopyToClipboard';

const ModalBuyNFT = ({ open, onCancel, selectedNFT }: any) => {
  const [text, copy] = useCopyToClipboard();

  const { isConnected, account, address } = useAccount();
  const { connectWallet, getDcoin } = useStore();
  const { provider } = useProvider();
  const [loading, setLoading] = useState(false);

  const TOKEN_ID = selectedNFT?.token_id;
  const NFT_PRICE = selectedNFT?.price;

  const onBuy = async () => {
    if (!isConnected) {
      connectWallet();
      return;
    }

    setLoading(true);

    try {
      const { abi } = await provider.getClassAt(
        process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string
      );

      const erc20Contract = new Contract(
        abi,
        process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
        provider
      );

      const allowance = await erc20Contract.allowance(
        address,
        process.env.NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string
      );

      const isNeedToApprove = Number(allowance) < NFT_PRICE;

      const tx = await account?.execute([
        ...(!isNeedToApprove
          ? []
          : [
              {
                contractAddress: process.env
                  .NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS as string,
                entrypoint: 'approve',
                calldata: CallData.compile({
                  spender: process.env
                    .NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
                  amount: cairo.uint256(NFT_PRICE * 10 ** 18),
                }),
              },
            ]),
        {
          contractAddress: process.env
            .NEXT_PUBLIC_MARKET_CONTRACT_ADDRESS as string,
          entrypoint: 'buy_nft',
          calldata: CallData.compile({
            token_id: cairo.uint256(TOKEN_ID),
          }),
        },
      ]);

      await provider.waitForTransaction(tx?.transaction_hash as any);
      toastSuccess('Buy success!');
      getDcoin();
      onCancel();
    } catch (err) {
      console.log(err);
      toastError('Buy failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomModal width={450} open={open} onCancel={onCancel}>
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68]'>
        <h4 className='text-[48px] font-[500] text-[#031F68] text-center'>
          Checkout
        </h4>

        <div className='overflow-y-auto scrollbar-custom max-h-[80vh] mt-[30px]'>
          <div className='text-white flex justify-between items-center gap-[24px]'>
            <CustomImage
              src={selectedNFT?.image}
              alt='nft'
              width={100}
              height={100}
              className='rounded-2xl'
            />
            <div className='flex-1 flex flex-col justify-between truncate '>
              <span className='truncate text-[24px] text-[#031F68] font-[400]'>
                {selectedNFT?.name}
              </span>
              <p className='text-[16px] font-[300] text-[#546678]'>
                Price
                <span className='text-[#031F68] text-[18px] font-[400] ml-[0.5rem]'>
                  {selectedNFT?.price} BLING
                </span>
              </p>
            </div>
            <div className='space-x-1 flex items-center'>
              <span className='text-sm '>{selectedNFT?.price} DCOIN</span>
            </div>
          </div>
          <div className='flex items-center text-[16px] justify-between text-[#031F68] mt-[40px]'>
            <span className='text-[#546678] font-[300]'>Total Price</span>
            <div className='space-x-1 flex items-center font-medium text-base'>
              {selectedNFT?.price} BLING
            </div>
          </div>
          <div className='flex items-center text-[16px] justify-between text-[#031F68] mt-[10px]'>
            <span className='text-[#546678] font-[300]'>You will pay</span>
            <div className='space-x-1 flex items-center font-medium text-base'>
              {selectedNFT?.price} BLING
            </div>
          </div>
        </div>

        <div className='mt-[40px]'>
          <CustomButton
            onClick={onBuy}
            className='btn-primary w-full'
            loading={loading}
          >
            Buy Now
          </CustomButton>
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalBuyNFT;
