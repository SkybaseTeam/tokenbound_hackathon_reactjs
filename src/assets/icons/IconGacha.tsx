import * as React from 'react';
import { SVGProps } from 'react';
const IconGacha = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={25}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill={props?.fill || '#8CA3E1'}
      d='m13.55 8.11 1.32 2.64c.18.36.66.72 1.06.78l2.39.4c1.53.26 1.89 1.36.79 2.46l-1.86 1.87c-.31.31-.49.92-.39 1.36l.53 2.31c.42 1.82-.55 2.53-2.16 1.58l-2.24-1.33c-.41-.24-1.07-.24-1.48 0L9.26 21.5c-1.61.95-2.58.24-2.16-1.58l.53-2.31c.1-.43-.08-1.04-.39-1.36L5.39 14.4c-1.1-1.1-.74-2.21.79-2.46l2.39-.4c.4-.07.88-.42 1.06-.78l1.32-2.64c.71-1.44 1.89-1.44 2.6-.01ZM6.25 9.75c-.41 0-.75-.34-.75-.75V2c0-.41.34-.75.75-.75S7 1.59 7 2v7c0 .41-.34.75-.75.75ZM18.25 9.75c-.41 0-.75-.34-.75-.75V2c0-.41.34-.75.75-.75s.75.34.75.75v7c0 .41-.34.75-.75.75ZM12.25 4.75c-.41 0-.75-.34-.75-.75V2c0-.41.34-.75.75-.75s.75.34.75.75v2c0 .41-.34.75-.75.75Z'
    />
  </svg>
);
export default IconGacha;