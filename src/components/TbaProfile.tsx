import React, { useEffect } from 'react';
import CustomImage from './custom/CustomImage';
import CustomTooltip from './custom/CustomTooltip';
import useCopyToClipboard from '@/hook/useCopyToClipboard';
import { formatDecimal, formatWallet } from '@/utils';
import IconLogout from '@/assets/icons/IconLogout';
import { useRouter } from 'next/navigation';
import { useStore } from '@/context/store';
import useMounted from '@/hook/useMounted';

const TbaProfile = () => {
  const [text, copy] = useCopyToClipboard();
  const router = useRouter();
  const { point, fetchPoint, tbaLoginData } = useStore();
  const { isMounted } = useMounted();

  useEffect(() => {
    isMounted && fetchPoint(tbaLoginData?.tokenboundAddress);
  }, [isMounted]);

  return (
    <div className=''>
      <p className='text-[18px]'>Your Token-Bound Account</p>
      <div className='inline-block'>
        <div className='flex items-center rounded-2xl gap-[12px] px-[12px] py-[10px] text-[16px] font-[400] border border-[#EFFEA3] bg-[#FBFDEB] mt-[1rem]'>
          <CustomImage
            src={tbaLoginData?.tba_image}
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
                  <p
                    onClick={() =>
                      copy(tbaLoginData?.tokenboundAddress as string)
                    }
                    // className='mt-[0.3rem]'
                  >
                    {formatWallet(tbaLoginData?.tokenboundAddress)}
                  </p>
                </div>
              </CustomTooltip>
              <IconLogout
                className='cursor-pointer'
                fill='#ef4444'
                onClick={() => {
                  router.push('/game');
                }}
              />
            </div>
            <div className='text-[16px] font-[400] text-[#031F68]  flex items-center mt-[8px]'>
              <p>Points: {formatDecimal(point)}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TbaProfile;
