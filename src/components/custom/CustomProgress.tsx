import { Progress, ProgressProps } from 'antd';
import React from 'react';

interface ICustomProgress extends ProgressProps {}

const CustomProgress = ({
  strokeColor = '#0538BD',
  trailColor = '#B2C1EB',
  className = '',
  ...props
}: ICustomProgress) => {
  return (
    <Progress
      className={'custom-progress ' + className}
      strokeColor={strokeColor}
      trailColor={trailColor}
      {...props}
    />
  );
};

export default CustomProgress;
