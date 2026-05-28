'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// ⚙️ [통계 설정] 우리가 직접 숫자를 조절하고 관리할 수 있는 통계 변수야!
const TOTAL_RESCUED = 142; // 이 숫자를 바꾸면 화면 통계가 즉시 변경돼!

interface Store {
  id: string;
  name: string;
  address: string; // 🗺️ 실제 매장 주소
}

export default function HomePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenMap, setIsOpenMap] = useState(false);
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [selectedStoreAddress, setSelectedStoreAddress] = useState(''); // 🗺️ 지도에 띄울 실제 주소

  // 1. DB에서 가짜 데이터 없이 실제 등록된 매장 목록만 긁어오기
  useEffect(() => {
    async function fetchStores() {
      try {
        const { data, error } = await supabase
          .from('stores')
          .select('id, name, address'); // address 컬럼 추가 조회

        if (error) throw error;
        if (data) setStores(data);
      } catch (err) {
        console.error('매장 정보를 가져오는데 실패했습니다:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchStores();
  }, []);

  // 2. 지도 열기 함수 (가게명과 사장님이 입력한 '진짜 주소'를 함께 팝업에 넘겨줌)
  const openMap = (e: React.MouseEvent, name: string, address: string) => {
    e.stopPropagation(); // 카드를 클릭했을 때 가게 상세 화면으로 넘어가는 현상 방지
    setSelectedStoreName(name);
    setSelectedStoreAddress(address || name); // 혹시 주소가 비어있다면 가게 이름으로 대체
    setIsOpenMap(true);
  };

  return (
    <div style={{ backgroundColor: '#FDFBF7', minHeight: '100vh' }}>
      {/* 🟢 소비자 전용 상단바 */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          backgroundColor: '#8B4513',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🍞</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            빵과 사는 남자들 (소비자용)
          </span>
        </div>
        <Link
          href="/"
          style={{
            color: 'white',
            textDecoration: 'none',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '5px',
          }}
        >
          🚪 로그아웃
        </Link>
      </nav>

      {/* 본문 콘텐츠 */}
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        {/* 🌍 자원순환 통계 박스 (우리가 상단 변수에서 제어함) */}
        <div
          style={{
            backgroundColor: '#FFF8DC',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #DEB887',
          }}
        >
          <h2 style={{ margin: 0, color: '#8B4513', fontSize: '18px' }}>
            🌍 지구를 살리는 자원순환 통계
          </h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '16px', color: '#333' }}>
            우리 동네에서 지금까지 총{' '}
            <strong style={{ color: '#FF4500' }}>{TOTAL_RESCUED}개</strong>의
            빵을 구출했어요!
          </p>
        </div>

        <h1 style={{ color: '#8B4513', fontSize: '22px' }}>
          🥖 오늘의 우리동네 마감 빵 매장
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          매장을 선택하면 오늘 남은 마감 빵 목록을 볼 수 있습니다.
        </p>
        <hr
          style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ddd' }}
        />

        {/* 🏢 실시간 매장 리스트 공간 */}
        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {isLoading ? (
            <p style={{ color: '#000' }}>매장 정보를 불러오는 중입니다...</p>
          ) : stores.length === 0 ? (
            // ❌ 가짜 카드가 완전히 사라지고 데이터가 없을 때 뜨는 진짜 안내문구야!
            <div
              style={{
                padding: '40px 20px',
                textAlign: 'center',
                backgroundColor: 'white',
                border: '1px solid #ddd',
                borderRadius: '8px',
                width: '100%',
                maxWidth: '400px',
              }}
            >
              <span style={{ fontSize: '40px' }}>🏪</span>
              <p
                style={{ color: '#666', marginTop: '10px', fontWeight: 'bold' }}
              >
                현재 등록된 마감 빵 매장이 없습니다.
              </p>
              <p style={{ color: '#999', fontSize: '13px', margin: 0 }}>
                첫 번째 사장님이 되어 매장을 등록해 보세요!
              </p>
            </div>
          ) : (
            // ⭕ DB에 실제 등록된 매장들만 출력되는 공간!
            stores.map((store) => (
              <div
                key={store.id}
                onClick={() =>
                  (window.location.href = `/home/store/${store.id}`)
                }
                style={{
                  border: '1px solid #ddd',
                  padding: '20px',
                  borderRadius: '12px',
                  width: '280px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
                  boxShadow: '0 4px 6px rgba(0,0,0,0.04)',
                  transition: 'transform 0.2s',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '10px',
                  }}
                >
                  <span style={{ fontSize: '20px' }}>🏪</span>
                  <h3 style={{ margin: 0, color: '#000', fontSize: '18px' }}>
                    {store.name}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    margin: '0 0 15px 0',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  📍 {store.address || '주소 미등록 매장'}
                </p>
                <button
                  onClick={(e) => openMap(e, store.name, store.address)}
                  style={{
                    width: '100%',
                    padding: '8px',
                    backgroundColor: '#F5F5DC',
                    color: '#8B4513',
                    border: '1px solid #8B4513',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontWeight: 'bold',
                  }}
                >
                  🗺️ 매장 위치 보기
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 🗺️ 실제 주소 기반 동적 지도 팝업 */}
      {isOpenMap && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '10px',
              width: '90%',
              maxWidth: '500px',
              textAlign: 'center',
            }}
          >
            <h3 style={{ margin: '0 0 5px 0', color: '#000' }}>
              📍 {selectedStoreName} 위치 안내
            </h3>
            <p
              style={{ fontSize: '13px', color: '#666', margin: '0 0 15px 0' }}
            >
              {selectedStoreAddress}
            </p>

            {/* 💡 사장님이 입력한 실제 주소(selectedStoreAddress)가 구글 지도 검색창에 동적으로 연결돼! */}
            <iframe
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '8px' }}
              loading="lazy"
              src={`http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(selectedStoreAddress)}&t=&z=16&ie=UTF-8&iwloc=&output=embed`}
            ></iframe>

            <button
              onClick={() => setIsOpenMap(false)}
              style={{
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                width: '100%',
                cursor: 'pointer',
                fontWeight: 'bold',
              }}
            >
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
