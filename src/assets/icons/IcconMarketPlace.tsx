import * as React from 'react';
import { SVGProps } from 'react';
const IconMarketPlace = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={25}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props?.fill || '#8CA3E1'}
      d='m20.08 8.7-4.53-4.53a4.75 4.75 0 0 0-3.6-1.39l-5 .24c-2 .09-3.59 1.68-3.69 3.67l-.24 5c-.06 1.34.44 2.65 1.39 3.6l4.53 4.53a4.78 4.78 0 0 0 6.75 0l4.39-4.39a4.738 4.738 0 0 0 0-6.73ZM9.75 12.38a2.88 2.88 0 1 1 .002-5.762 2.88 2.88 0 0 1-.002 5.762Z'
    />
  </svg>
);
export default IconMarketPlace;
