'use client';

import React, { useEffect, useState } from 'react';
import useMounted from '@/hook/useMounted';
import { usePathname } from 'next/navigation';
import Loading from '@/app/loading';
import LayoutPrimary from './LayoutPrimary';
import LayoutAdmin from './LayoutAdmin';
import ModalWaitTransaction from '@/components/modal/ModalWaitTransaction';
import { useStore } from '@/context/store';
import { useAccount } from '@starknet-react/core';

const Layout = ({ children }: any) => {
  const { isMounted } = useMounted();
  const pathName = usePathname();
  const [currentLayout, setCurrentLayout] = useState(
    <LayoutPrimary>{children}</LayoutPrimary>
  );
  const { address } = useAccount();
  const { showModalWaitTransaction, setShowModalWaitTransaction, getDcoin } =
    useStore();

  useEffect(() => {
    if (pathName === '/admin') {
      setCurrentLayout(<LayoutAdmin>{children}</LayoutAdmin>);
    } else {
      setCurrentLayout(<LayoutPrimary>{children}</LayoutPrimary>);
    }
  }, [pathName]);

  useEffect(() => {
    if (isMounted && address) {
      getDcoin();
    }
  }, [isMounted, address]);

  return (
    <>
      {!isMounted && <Loading />}
      {currentLayout}
      <ModalWaitTransaction
        open={showModalWaitTransaction}
        onCancel={() => {
          setShowModalWaitTransaction(false);
        }}
      />
    </>
  );
};

export default Layout;
