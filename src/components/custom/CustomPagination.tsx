import { Pagination, PaginationProps } from 'antd';
import React from 'react';

interface ICustomPaginationProps extends PaginationProps {
  className?: string;
}

const CustomPagination = ({ ...props }: ICustomPaginationProps) => {
  return (
    <div className={'custom-pagination'}>
      <Pagination {...props} />
    </div>
  );
};

export default CustomPagination;
