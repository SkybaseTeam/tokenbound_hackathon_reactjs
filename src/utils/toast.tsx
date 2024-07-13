import IconFailMessage from '@/assets/icons/IconFailMessage';
import IconTickMessage from '@/assets/icons/IconTickMessage';
import { message } from 'antd';

export const toastSuccess = (content: string) => {
  message.success({
    content,
    icon: <IconTickMessage />,
  });
};

export const toastError = (content: string) => {
  message.error({
    content,
    icon: <IconFailMessage />,
  });
};

export const toastWarning = (content: string) => {
  message.warning({
    content,
    // duration: 10000000,
    // icon: <IconTickMessage />,
  });
};
