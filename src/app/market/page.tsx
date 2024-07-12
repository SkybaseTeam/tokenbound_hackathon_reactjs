'use client';

import MarketContainer from '@/container/Market';
import MarketStoreProvider from '@/container/Market/context';

export default function Home() {
  return (
    <MarketStoreProvider>
      <MarketContainer />
    </MarketStoreProvider>
  );
}
