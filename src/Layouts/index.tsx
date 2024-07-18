'use client';

import React, { useEffect, useState } from 'react';
import useMounted from '@/hook/useMounted';
import { usePathname } from 'next/navigation';
import Loading from '@/app/loading';
import LayoutPrimary from './LayoutPrimary';
import ModalWaitTransaction from '@/components/modal/ModalWaitTransaction';
import { useStore } from '@/context/store';
import { useAccount } from '@starknet-react/core';
import LayoutGame from './LayoutGame';

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
    if (pathName.includes('/game/play')) {
      setCurrentLayout(<LayoutGame>{children}</LayoutGame>);
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
    <div className=''>
      {!isMounted && <Loading />}
      {currentLayout}
      <ModalWaitTransaction
        open={showModalWaitTransaction}
        onCancel={() => {
          setShowModalWaitTransaction(false);
        }}
      />
    </div>
  );
};

export default Layout;
