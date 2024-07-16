import React from 'react';
import CustomDrawer from '../custom/CustomDrawer';
import CustomTooltip from '../custom/CustomTooltip';
import CustomButton from '../custom/CustomButton';
import { useStore } from '@/context/store';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { useAccount } from '@starknet-react/core';
import { formatToken, formatWallet } from '@/utils';
import IconLogout from '@/assets/icons/IconLogout';
import CustomImage from '../custom/CustomImage';
import IconClose from '@/assets/icons/IconClose';
import IconCloseDrawer from '@/assets/icons/IconCloseDrawer';
import Logo from '../Logo';
import IconCopy from '@/assets/icons/IconCopy';

const DrawerMobile = ({ open, onClose, handleDisconnect, ethBalance }: any) => {
  const { address, isConnected } = useAccount();
  const [text, copy] = useCopyToClipboard();
  const { connectWallet, dcoin } = useStore();

  return (
    <CustomDrawer open={open} onClose={onClose} width={400}>
      <div className='font-glancyr px-[16px] py-[32px] bg-[#0538BD]  min-h-[var(--100vh)]'>
        <div className='flex justify-between mb-[2rem]'>
          <p className='text-[24px] text-[#fff]'>My Wallet</p>
          <IconCloseDrawer onClick={onClose} />
        </div>

        {isConnected ? (
          <div>
            <div className='flex items-center rounded-2xl gap-[10px] px-[12px] py-[10px] text-[16px] font-[400] border border-[#EFFEA3] bg-[#FBFDEB]'>
              <div className='flex items-center gap-[12px]'>
                <CustomImage
                  src='/images/default.webp'
                  width={70}
                  height={70}
                  alt='err'
                  className='rounded-2xl'
                />
                <div>
                  <div className='flex items-center gap-[8px]'>
                    <CustomTooltip
                      title='Copied'
                      placement='right'
                      trigger={['click']}
                    >
                      <div className='cursor-pointer text-[#031F68]'>
                        <p onClick={() => copy(address as string)}>
                          {formatWallet(address)}
                        </p>
                      </div>
                    </CustomTooltip>
                    <IconLogout
                      className='cursor-pointer'
                      fill='#ef4444'
                      onClick={handleDisconnect}
                    />
                  </div>
                  <div className='text-[16px] font-[400] text-[#031F68]  flex items-center mt-[8px]'>
                    <div>
                      {dcoin && address ? formatToken(dcoin, 18) : 0} BLING
                      <span className='px-[10px]'>|</span>
                      {ethBalance?.data && address
                        ? formatToken(ethBalance?.data?.value as any, 18) + ' '
                        : '0'}{' '}
                      {ethBalance?.data?.symbol || 'ETH'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // <div className='flex items-start rounded-2xl justify-between p-[12px] text-[16px] font-[400] bg-[#3760CA] mt-[1rem]'>
          //   <div>
          //     <div className='flex items-start items-center gap-[12px]'>
          //       <CustomImage
          //         src='/images/default.webp'
          //         width={80}
          //         height={80}
          //         alt='err'
          //         className='rounded-2xl'
          //       />
          //       <div>
          //         <div className='flex items-center gap-[8px] mt-[4px]'>
          //           <div className=' text-white flex items-center gap-[0.5rem]'>
          //             <p
          //             // className='mt-[0.3rem]'
          //             >
          //               {formatWallet(address)}
          //             </p>
          //             <CustomTooltip
          //               title='Copied Address'
          //               placement='right'
          //               trigger={['click']}
          //             >
          //               <div>
          //                 <IconCopy
          //                   className='cursor-pointer'
          //                   onClick={() => copy(address as string)}
          //                 />
          //               </div>
          //             </CustomTooltip>
          //           </div>
          //         </div>

          //         <div className='flex items-center gap-[12px]'>
          //           <div className='border border-[#DCFC36] text-[16px] font-[400] text-[#DCFC36] px-[12px] h-[36px] rounded-[32px] mt-[8px] inline-block'>
          //             <div className=' mt-[0.3rem]'>
          //               <div>
          //                 {dcoin && address ? formatToken(dcoin, 18) : 0} BLING
          //                 <span className='px-[10px]'>|</span>
          //                 {ethBalance?.data && address
          //                   ? formatToken(ethBalance?.data?.value as any, 18) +
          //                     ' '
          //                   : '0'}{' '}
          //                 {ethBalance?.data?.symbol || 'ETH'}
          //               </div>
          //             </div>
          //           </div>
          //         </div>
          //       </div>
          //     </div>
          //   </div>

          //   <IconLogout
          //     className='cursor-pointer'
          //     fill='#ef4444'
          //     onClick={handleDisconnect}
          //   />
          // </div>
          <CustomButton onClick={connectWallet} className='btn-primary w-full'>
            Connect Wallet
          </CustomButton>
        )}
      </div>
    </CustomDrawer>
  );
};

export default DrawerMobile;
