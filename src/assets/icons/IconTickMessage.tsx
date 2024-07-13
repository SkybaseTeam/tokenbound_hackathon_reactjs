import * as React from 'react';
import { SVGProps } from 'react';
const IconTickMessage = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width={24}
    height={24}
    fill='none'
    {...props}
  >
    <path
      fill='#0538BD'
      d='M12 1.5a10.5 10.5 0 1 1 0 21 10.5 10.5 0 0 1 0-21Zm-1.308 12.572L8.36 11.738a.902.902 0 0 0-1.274 1.273l2.97 2.97a.9.9 0 0 0 1.274 0l6.15-6.152a.9.9 0 1 0-1.273-1.273l-5.515 5.516Z'
    />
  </svg>
);
export default IconTickMessage;
