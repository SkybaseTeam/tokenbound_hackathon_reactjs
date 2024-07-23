import * as React from 'react';
import { SVGProps } from 'react';
const IconInventory = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={25}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props?.fill || '#8CA3E1'}
      d='M13.5 12.58v1.98a1.25 1.25 0 0 1-2.5 0v-1.98c-.36-.22-.64-.54-.84-.92H3.25c-.55 0-1 .45-1 1v3.53c0 3.21 2.6 5.81 5.81 5.81h8.37c3.22 0 5.82-2.6 5.82-5.81v-3.53c0-.55-.45-1-1-1h-6.91c-.2.38-.48.7-.84.92ZM16.44 2H8.06C4.85 2 2.25 4.6 2.25 7.81v1.35c0 .55.45 1 1 1h6.67a2.37 2.37 0 0 1 2.97-1.88c.8.21 1.45.86 1.66 1.66.02.07.02.15.03.22h6.67c.55 0 1-.45 1-1V7.81c0-3.21-2.6-5.81-5.81-5.81Z'
    />
  </svg>
);
export default IconInventory;
