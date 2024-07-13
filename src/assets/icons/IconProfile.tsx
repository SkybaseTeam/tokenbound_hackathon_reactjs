import * as React from 'react';
import { SVGProps } from 'react';
const IconProfile = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={25}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props?.fill || '#8CA3E1'}
      d='M12.25 2C9.63 2 7.5 4.13 7.5 6.75c0 2.57 2.01 4.65 4.63 4.74.08-.01.16-.01.22 0h.07A4.738 4.738 0 0 0 17 6.75C17 4.13 14.87 2 12.25 2ZM17.33 14.15c-2.79-1.86-7.34-1.86-10.15 0-1.27.85-1.97 2-1.97 3.23s.7 2.37 1.96 3.21c1.4.94 3.24 1.41 5.08 1.41 1.84 0 3.68-.47 5.08-1.41 1.26-.85 1.96-1.99 1.96-3.23-.01-1.23-.7-2.37-1.96-3.21Z'
    />
  </svg>
);
export default IconProfile;
