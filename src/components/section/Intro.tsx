import React from 'react';
import CustomImage from '../custom/CustomImage';
import Link from 'next/link';

const Intro = () => {
  return (
    <section
      id='intro_section'
      className='min-h-[var(--100vh)] flex flex-col items-center justify-center max-sm:px-[32px] max-lg:px-[64px]'
    >
      <div className='relative mt-[-5rem] max-lg:hidden'>
        <div className={'absolute top-[-3rem] left-[-2rem]'}>
          <CustomImage
            src='/images/intro/sound.webp'
            alt='bling'
            // data-aos='zoom-in-right'
            // data-aos-delay='400'
            className=' '
            width={196.747}
            height={140.464}
          />
        </div>
        <div className='absolute top-[0rem] right-[-2rem]'>
          <CustomImage
            src='/images/intro/stonk.webp'
            alt='err'
            // data-aos='zoom-in-right'
            // data-aos-delay='600'
            width={267.993}
            height={136.993}
          />
        </div>

        <CustomImage
          src='/images/intro/bling.webp'
          alt='err'
          // data-aos='flip-down'
          // data-aos-delay='200'
          width={1159}
          height={280}
        />
        <Link
          href='/game'
          className='absolute top-[-4rem] left-1/2  -translate-x-1/2 cursor-pointer'
        >
          <CustomImage
            src='/images/intro/play.webp'
            alt='err'
            className=' animateIntroPlay'
            width={200}
            height={215}
          />
        </Link>
      </div>

      <CustomImage
        src='/images/intro/bling-mobile.webp'
        alt='err'
        className='lg:hidden'
        // data-aos='flip-down'
        // data-aos-delay='200'
        width={379}
        height={299}
      />

      <div className='relative'>
        <div className='absolute top-[-1rem] left-[6rem]'>
          <CustomImage
            src='/images/intro/arrow.webp'
            alt='err'
            // data-aos='zoom-in-right'
            // data-aos-delay='200'
            className='max-lg:hidden'
            width={142}
            height={118}
          />
        </div>

        <a
          href='#mint_section'
          className='absolute bottom-[-10.7rem] left-[14rem] cursor-pointer'
        >
          <CustomImage
            src='/images/intro/mint.webp'
            alt='err'
            className=' animateIntroMint max-lg:hidden'
            width={200}
            height={215}
          />
        </a>

        <a
          href='#mint_section'
          className='absolute bottom-[-10rem] right-[-3rem] cursor-pointer'
        >
          <div className='relative max-lg:hidden'>
            <CustomImage
              src='/images/intro/mint-tba.webp'
              alt='err'
              className='animate-spin-slow'
              width={185}
              height={185}
            />
            <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'>
              <CustomImage
                src='/images/intro/arrow-tba.webp'
                alt='err'
                width={45}
                height={97.42}
              />
            </div>
          </div>
        </a>

        <h2 className='text-[16px] sm:text-[32px] lg:text-[60px] font-[500] text-center'>
          Reach the Future <br /> Trade ERC-6551 Token-Bound Accounts
        </h2>
      </div>
    </section>
  );
};

export default Intro;
