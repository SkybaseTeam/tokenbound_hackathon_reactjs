'use client';

import { createContext, useContext, useState } from 'react';

const storeContext = createContext<any>(null);

export const useMarketStore = () => useContext(storeContext);

const MarketStoreProvider = ({ children }: any) => {
  return <storeContext.Provider value={{}}>{children}</storeContext.Provider>;
};
export default MarketStoreProvider;
