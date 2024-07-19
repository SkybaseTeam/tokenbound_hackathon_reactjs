import * as React from 'react';
import { SVGProps } from 'react';
const IconPower = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <g clipPath='url(#a)'>
      <path
        fill='#DCFC36'
        stroke='#031F68'
        d='M8.542 2.803a.509.509 0 0 1 .466-.303h7.977a.51.51 0 0 1 .456.738l-2.27 4.538-.361.724h4.167a.51.51 0 0 1 .36.87L7.384 21.323c-.382.382-1.014-.012-.844-.52l2.548-7.645.22-.658H5.016a.51.51 0 0 1-.466-.717l3.992-8.98Z'
      />
    </g>
    <defs>
      <clipPath id='a'>
        <path fill='#fff' d='M0 0h24v24H0z' />
      </clipPath>
    </defs>
  </svg>
);
export default IconPower;
