import React from 'react';
import CustomDrawer from '../custom/CustomDrawer';
import CustomTooltip from '../custom/CustomTooltip';
import CustomButton from '../custom/CustomButton';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import IconLogout from '@/assets/icons/IconLogout';
import CustomImage from '../custom/CustomImage';
import IconCloseDrawer from '@/assets/icons/IconCloseDrawer';
import IconCopy from '@/assets/icons/IconCopy';
import { useRouter } from 'next/navigation';
import { formatDecimal, formatWallet, tbaPowerBg } from '@/utils';

const DrawerMobileGame = ({
  open,
  onClose,
  tbaLoginData,
  setAccessToken,
  loadingWithDraw,
  onWithDraw,
  blingTba,
}: any) => {
  const [text, copy] = useCopyToClipboard();
  const router = useRouter();

  return (
    <CustomDrawer open={open} onClose={onClose} width={400}>
      <div className='font-glancyr px-[16px] py-[32px] bg-[#0538BD]  min-h-[var(--100vh)]'>
        <div className='flex justify-between mb-[2rem]'>
          <p className='text-[24px] text-[#fff]'>My Token-Bound</p>
          <IconCloseDrawer onClick={onClose} />
        </div>
        <div className=''>
          <div className=' rounded-2xl p-[12px] text-[16px] font-[400] bg-[#3760CA]  relative'>
            <div>
              <div className='flex items-start sm:items-center gap-[12px]'>
                <CustomImage
                  src={tbaLoginData?.tba_image}
                  width={60}
                  height={60}
                  alt='err'
                  className='rounded-2xl'
                  style={{
                    background: tbaPowerBg(tbaLoginData?.power),
                  }}
                />

                <div className='flex flex-col gap-[3px] mt-[4px]'>
                  <div className=' text-white flex items-center gap-[0.5rem]'>
                    {tbaLoginData?.tba_name}
                  </div>
                  <div className=' text-white flex items-center gap-[0.5rem]'>
                    <p
                    // className='mt-[0.3rem]'
                    >
                      {formatWallet(tbaLoginData?.tba_address)}
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
              </div>
              <div className='border border-[#DCFC36]  mt-[1rem] text-[16px] font-[400] text-[#DCFC36] px-[12px] p-[8px] rounded-[32px] grid grid-cols-2 items-center w-full'>
                <CustomButton
                  loading={loadingWithDraw}
                  className='btn-primary h-[2.2rem] '
                  onClick={onWithDraw}
                  disabled={blingTba <= 0}
                >
                  WithDraw
                </CustomButton>

                <div className='text-center border-l ml-[1rem] border-[#DCFC36]'>
                  {' '}
                  {blingTba || 0} BLING
                </div>

                {/*   {ethBalance?.data && address
                ? formatToken(ethBalance?.data?.value as any, 18) + ' '
                : '0'}{' '}
              {ethBalance?.data?.symbol || 'ETH'} */}
              </div>
            </div>

            <IconLogout
              className='cursor-pointer absolute right-[8px] top-[8px]'
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
      </div>
    </CustomDrawer>
  );
};

export default DrawerMobileGame;
