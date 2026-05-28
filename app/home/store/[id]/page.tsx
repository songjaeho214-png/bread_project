'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/navigation';

interface BreadItem {
  id: string;
  name: string;
  original_price: number;
  discount_price: number;
  count: number;
}

interface StoreInfo {
  name: string;
  address: string;
}

export default function StoreDetailPage() {
  const params = useParams();
  const router = useRouter();
  const storeId = params?.id as string; // URL에서 store id 추출

  const [store, setStore] = useState<StoreInfo | null>(null);
  const [breads, setBreads] = useState<BreadItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!storeId) return;

    async function fetchStoreAndBreads() {
      try {
        // 1. 해당 매장 정보 불러오기
        const { data: storeData, error: storeError } = await supabase
          .from('stores')
          .select('name, address')
          .eq('id', storeId)
          .single();

        if (storeError) throw storeError;
        setStore(storeData);

        // 2. 해당 매장에 등록된 수량이 1개 이상인 마감 빵 리스트 가져오기
        const { data: breadData, error: breadError } = await supabase
          .from('breads')
          .select('*')
          .eq('store_id', storeId)
          .gt('count', 0); // 수량이 0보다 큰 실재고만 노출

        if (breadError) throw breadError;
        setBreads(breadData || []);
      } catch (err) {
        console.error('상세 데이터 조회 실패:', err);
        alert('존재하지 않거나 삭제된 매장입니다.');
        router.push('/home');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStoreAndBreads();
  }, [storeId]);

  if (isLoading) {
    return (
      <div
        style={{
          backgroundColor: '#FDFBF7',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#8B4513',
          fontWeight: 'bold',
        }}
      >
        🍞 맛있는 빵 목록을 불러오는 중...
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundColor: '#FDFBF7',
        minHeight: '100vh',
        fontFamily: 'sans-serif',
        color: '#000',
      }}
    >
      {/* 상단 내비바 */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          backgroundColor: '#8B4513',
          color: 'white',
        }}
      >
        <span
          style={{ fontSize: '18px', fontWeight: 'bold', cursor: 'pointer' }}
          onClick={() => router.push('/home')}
        >
          ⬅️ 뒤로가기
        </span>
        <span style={{ fontSize: '18px', fontWeight: 'bold' }}>
          🛒 마감 빵 구출 매대
        </span>
        <div style={{ width: '50px' }}></div>
      </nav>

      {/* 가게 정보 헤더 */}
      <div
        style={{
          backgroundColor: 'white',
          padding: '30px 20px',
          textAlign: 'center',
          borderBottom: '1px solid #ddd',
        }}
      >
        <span style={{ fontSize: '45px' }}>🏪</span>
        <h1
          style={{ margin: '10px 0 5px 0', fontSize: '26px', color: '#8B4513' }}
        >
          {store?.name}
        </h1>
        <p style={{ margin: 0, color: '#666', fontSize: '14px' }}>
          📍 {store?.address}
        </p>
      </div>

      {/* 실시간 빵 가판대 */}
      <div
        style={{ padding: '25px 20px', maxWidth: '500px', margin: '0 auto' }}
      >
        <h2 style={{ fontSize: '18px', color: '#333', marginBottom: '15px' }}>
          🥐 오늘 구출 가능한 빵 목록
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {breads.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '40px 10px',
                backgroundColor: '#fff',
                borderRadius: '10px',
                border: '1px solid #eee',
              }}
            >
              <p style={{ color: '#999', margin: 0, fontSize: '15px' }}>
                😭 아쉽게도 현재 남은 마감 빵이 없습니다.
              </p>
            </div>
          ) : (
            breads.map((bread) => (
              <div
                key={bread.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #ddd',
                  padding: '20px',
                  borderRadius: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                }}
              >
                <div>
                  <h3
                    style={{
                      margin: '0 0 6px 0',
                      fontSize: '18px',
                      color: '#000',
                    }}
                  >
                    {bread.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span
                      style={{
                        textDecoration: 'line-through',
                        color: '#999',
                        fontSize: '14px',
                      }}
                    >
                      {bread.original_price.toLocaleString()}원
                    </span>
                    <span
                      style={{
                        color: '#FF4500',
                        fontWeight: 'bold',
                        fontSize: '16px',
                      }}
                    >
                      {bread.discount_price.toLocaleString()}원
                    </span>
                  </div>
                </div>
                <div
                  style={{
                    backgroundColor: '#FFF5F5',
                    border: '1px solid #FFCDCD',
                    padding: '8px 15px',
                    borderRadius: '20px',
                    textAlign: 'center',
                  }}
                >
                  <span
                    style={{
                      color: '#D32F2F',
                      fontWeight: 'bold',
                      fontSize: '14px',
                    }}
                  >
                    재고 {bread.count}개
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
