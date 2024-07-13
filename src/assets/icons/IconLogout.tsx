import * as React from 'react';
import { SVGProps } from 'react';
const IconLogout = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill={props?.fill || 'none'}
    {...props}
  >
    <path
      fill={props?.fill || '#fff'}
      d='M13 4.01a1 1 0 0 0-2 0l-.004 8.003a1 1 0 0 0 2 0L13 4.01Z'
    />
    <path
      fill={props?.fill || '#fff'}
      d='M4 12.993c0-2.21.895-4.21 2.343-5.657L7.757 8.75a6 6 0 1 0 8.485 0l1.415-1.414A8 8 0 1 1 4 12.993Z'
    />
  </svg>
);
export default IconLogout;
