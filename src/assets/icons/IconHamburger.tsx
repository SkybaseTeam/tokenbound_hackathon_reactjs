import * as React from 'react';
import { SVGProps } from 'react';
const IconHamburger = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <path
      stroke='#fff'
      strokeLinecap='round'
      strokeWidth={1.5}
      d='M3 7h18M3 12h18M3 17h18'
    />
  </svg>
);
export default IconHamburger;
