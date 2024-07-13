'use client';

import CustomImage from '@/components/custom/CustomImage';

export default function Why() {
  return (
    <section
      id='why_section'
      className='bg-white rounded-[32px] pt-[86px] text-[#031F68] pb-[198px]'
    >
      <div className='layout-container flex flex-col items-center'>
        <CustomImage
          src='/images/why/arrow.webp'
          alt='err'
          className='animate-bounce mb-[-4rem]'
          width={120}
          height={112}
        />
        <h2 className='text-[48px] font-[500] font-glancyr'>
          Why BLING BLING?!?
        </h2>
        <div className=' w-full mt-[63px] grid grid-cols-3 gap-[24px] font-glancyr min-h-[360px]'>
          <div
            data-aos='fade-right'
            data-aos-delay={200}
            className='p-[24px] rounded-2xl bg-[#0538BD]'
          >
            <h2 className='text-[48px] text-[#DCFC36]'>ERC-6551</h2>
            <p className='mt-[27px] text-[16px] font-[300] text-[#E8FD78]'>
              {`They're not just pictures; they're like mini-vaults on the
              blockchain. This means the token itself can hold other things,
              like other tokens or even cryptocurrency.`}
            </p>
          </div>
          <div
            data-aos='fade-right'
            data-aos-delay={400}
            className='p-[24px] rounded-2xl bg-[#E3FD5E]'
          >
            <h2 className='text-[48px]  text-[#0538BD] leading-[56px]'>
              User-friendly Interface
            </h2>
            <p className='mt-[27px] text-[16px] font-[300] text-[#587AD3]'>
              {`Buying, selling, and trading ERC-6551 tokens is as simple as using any familiar online store. 
              Our intuitive interface guides you through each step, making it easy to find the 
              data you need and manage your token portfolio effortlessly.`}
            </p>
          </div>
          <div
            data-aos='fade-right'
            data-aos-delay={600}
            className='p-[24px] rounded-2xl bg-[#F4FEC1]'
          >
            <h2 className='text-[48px]  text-[#0538BD]'>Security</h2>
            <p className='mt-[27px] text-[16px] font-[300] text-[#587AD3]'>
              {`We utilize industry-leading security measures to safeguard your ERC-6551 tokens.
               Every transaction is meticulously recorded on the blockchain,
                ensuring complete transparency. `}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
