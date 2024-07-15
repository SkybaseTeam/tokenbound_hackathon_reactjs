import { useState } from 'react';
import CustomButton from './custom/CustomButton';

const steps = [
  { id: 1, label: '2 Points', points: 2, claimed: false },
  { id: 2, label: '5 Points', points: 5, claimed: false },
  { id: 3, label: '8 Points', points: 8, claimed: false },
  { id: 4, label: '9 Points', points: 9, claimed: false },
];

const Achievement = ({ userPoints }: any) => {
  const [stepsState, setStepsState] = useState(steps);

  const handleClaim = (id: any) => {
    setStepsState(
      stepsState.map((step) =>
        step.id === id ? { ...step, claimed: true } : step
      )
    );
  };

  return (
    <div className='flex flex-col items-center gap-[0.5rem]'>
      <p className='font-[500] text-[28px] sm:text-[48px]'>
        <span className='text-white'>5 Point</span>{' '}
        <span className='text-[18px] sm:text-[30px] text-[#B2C1EB] sm:px-[30px]'>
          to get
        </span>{' '}
        <span className='text-[#DCFC36]'>10 BLING</span>
      </p>
      <CustomButton className='btn-primary w-[136px]' disabled>
        Claim
      </CustomButton>
    </div>
  );
};

export default Achievement;
