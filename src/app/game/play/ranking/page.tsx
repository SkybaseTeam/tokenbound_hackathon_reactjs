'use client';

import IconLoading from '@/assets/icons/IconLoading';
import CardRank from '@/components/CardRank';
import CustomPagination from '@/components/custom/CustomPagination';
import ModalTbaDetail from '@/components/modal/ModalTbaDetail';
import { useStore } from '@/context/store';
import { fetchTbaRank } from '@/fetching/client/tba';

import useMounted from '@/hook/useMounted';
import { toastError } from '@/utils/toast';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const Ranking = () => {
  const { accessToken } = useStore();
  const { isMounted } = useMounted();
  const router = useRouter();
  const [rankData, setRankData] = useState<any>();
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showModalTbaDetail, setShowModalTbaDetail] = useState(false);
  const [selectedNFT, setSelectedNFT] = useState<any>();

  useEffect(() => {
    if (!accessToken) {
      router.push('/game');
    }
  }, []);

  useEffect(() => {
    if (!isMounted || !accessToken) return;
    setLoading(true);
    fetchTbaRank({ page, limit: 5 })
      .then((res) => {
        setRankData(res?.data);
      })
      .catch((err) => {
        toastError('Get rank failed');
        console.log(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [isMounted, accessToken, page]);

  return (
    accessToken && (
      <div className='layout-container scale_layout max-w-[583px] pb-[7rem] pt-[5rem] sm:py-[6rem]'>
        <div className='flex justify-between items-center w-full'>
          <h1 className='text-[48px] font-[500] text-[#DCFC36]'>RANKING</h1>
          {loading && (
            <div className='flex justify-center w-full'>
              <IconLoading fill='white' className='animate-spin' />
            </div>
          )}
        </div>

        <div className='flex flex-col gap-[12px] mt-[35px]'>
          {rankData &&
            rankData?.data?.map((item: any) => (
              <div
                onClick={() => {
                  setShowModalTbaDetail(true);
                  setSelectedNFT(item);
                }}
                key={item?._id}
              >
                <CardRank data={item} />
              </div>
            ))}
          <div className='flex justify-center w-full mt-[12px]'>
            <CustomPagination
              showSizeChanger={false}
              current={page}
              onChange={(paginationPage) => {
                setPage(paginationPage);
              }}
              total={rankData?.pagination?.total}
              pageSize={5}
            />
          </div>
        </div>
        <ModalTbaDetail
          open={showModalTbaDetail}
          onCancel={() => {
            setShowModalTbaDetail(false);
          }}
          showBuy={false}
          selectedNFT={selectedNFT}
        />
      </div>
    )
  );
};

export default Ranking;
