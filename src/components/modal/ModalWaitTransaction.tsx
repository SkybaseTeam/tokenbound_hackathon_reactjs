import React from 'react';
import CustomModal from '../custom/CustomModal';

import CustomButton from '../custom/CustomButton';

import { useRouter } from 'next/navigation';
import { useAccount } from '@starknet-react/core';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import IconLoading from '@/assets/icons/IconLoading';

const ModalWaitTransaction = ({ open, onCancel }: any) => {
  const router = useRouter();
  const { address } = useAccount();
  const [text, copy] = useCopyToClipboard();

  return (
    <CustomModal
      closable={false}
      maskClosable={false}
      width={450}
      open={open}
      onCancel={onCancel}
      closeIcon={null}
    >
      <div className='sm:p-[24px] p-[12px] font-glancyr text-[#031F68] flex items-center flex-col'>
        <h4 className='text-[48px] font-[500] text-[#031F68] text-center'>
          Waiting
        </h4>
        <IconLoading className='animate-spin origin-center' />
        <div className='mt-[30px] text-[16px] font-[300] text-[#546678]'>
          Waiting for transaction on Blockchain
        </div>
      </div>
    </CustomModal>
  );
};

export default ModalWaitTransaction;
