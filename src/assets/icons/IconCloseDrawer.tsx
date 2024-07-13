import * as React from 'react';
import { SVGProps } from 'react';
const IconCloseDrawer = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className='cursor-pointer'
    xmlns='http://www.w3.org/2000/svg'
    width={32}
    height={32}
    fill='none'
    viewBox='0 0 24 24'
    {...props}
  >
    <path
      stroke='#fff'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth={1.5}
      d='M6 18 18 6M18 18 6 6'
    />
  </svg>
);
export default IconCloseDrawer;
