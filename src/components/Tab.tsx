import { useRouter } from 'next/navigation';
import React from 'react';

interface ITab {
  tabData: { id: number; title: string }[];
  activeTab: string;
}

const Tab = ({ tabData, activeTab }: ITab) => {
  const router = useRouter();
  return (
    <div className={`flex items-center gap-[8px] overflow-x-auto hide_scrollbar`}>
      {tabData.map((item) => (
        <div
          key={item.id}
          className={`${(activeTab === item.title.toLowerCase() || activeTab === 'All') && '!text-white bg-[#0538BD]'} text-[16px] text-[#0538BD] px-[12px] py-[6px] border border-[#0538BD] rounded-[32px] cursor-pointer`}
          onClick={() => {
            router.push('?tab=' + item.title.toLowerCase());
          }}
        >
          <p className='active:translate-y-[8%]'>{item.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Tab;
