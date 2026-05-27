'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function HomePage() {
  const [breadQuantity, setBreadQuantity] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOpenMap, setIsOpenMap] = useState(false);
  const [selectedStore, setSelectedStore] = useState('');

  useEffect(() => {
    async function fetchQuantity() {
      try {
        const { data, error } = await supabase
          .from('closing_items')
          .select('quantity')
          .eq('id', '22222222-2222-2222-2222-222222222222')
          .single();

        if (error) throw error;
        if (data) setBreadQuantity(data.quantity);
      } catch (err) {
        console.error('데이터를 가져오는데 실패했습니다:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchQuantity();
  }, []);

  const openMap = (storeName: string) => {
    setSelectedStore(storeName);
    setIsOpenMap(true);
  };

  return (
    <div>
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
        <div>
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
        </div>
      </nav>

      {/* 본문 콘텐츠 */}
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <div
          style={{
            backgroundColor: '#FFF8DC',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          <h2 style={{ margin: 0, color: '#8B4513' }}>
            🌍 지구를 살리는 자원순환 통계
          </h2>
          <p style={{ margin: '5px 0 0 0', fontSize: '18px' }}>
            우리 동네에서 지금까지 총{' '}
            <strong style={{ color: '#FF4500' }}>142개</strong>의 빵을
            구출했어요! (오늘 구출: 12개)
          </p>
        </div>

        <h1 style={{ color: '#8B4513' }}>🥖 오늘의 도마동 마감 빵 현황</h1>
        <p>지금 당장 빵집에 방문해서 저렴하게 마감 빵을 픽업해 보세요!</p>
        <hr style={{ margin: '20px 0' }} />

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          <div
            style={{
              border: '1px solid #ddd',
              padding: '15px',
              borderRadius: '8px',
              width: '280px',
              backgroundColor: 'white',
            }}
          >
            <span
              style={{
                backgroundColor: '#FFD700',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              ⏰ 21:00 마감
            </span>
            <h3 style={{ margin: '10px 0 5px 0' }}>🥐 단팥빵</h3>
            <p
              style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}
            >
              매장명: 도마동 대박빵집
            </p>
            <div style={{ marginBottom: '10px' }}>
              <span
                style={{
                  textDecoration: 'line-through',
                  color: '#aaa',
                  marginRight: '5px',
                }}
              >
                2,500원
              </span>
              <strong style={{ color: '#FF4500', fontSize: '18px' }}>
                1,500원
              </strong>
            </div>
            <p
              style={{ fontWeight: 'bold', color: '#008000', fontSize: '16px' }}
            >
              남은 수량: {isLoading ? '확인 중...' : `${breadQuantity ?? 0}개`}
            </p>
            <button
              onClick={() => openMap('도마동 대박빵집')}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              매장 위치 보기
            </button>
          </div>

          <div
            style={{
              border: '2px solid #8B4513',
              padding: '15px',
              borderRadius: '8px',
              width: '280px',
              backgroundColor: '#FFFDF9',
            }}
          >
            <span
              style={{
                backgroundColor: '#8B4513',
                color: 'white',
                padding: '2px 6px',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: 'bold',
              }}
            >
              📦 마감 랜덤박스
            </span>
            <h3 style={{ margin: '10px 0 5px 0' }}>🎁 사장님 추천 빵 꾸러미</h3>
            <p
              style={{ margin: '0 0 10px 0', color: '#666', fontSize: '14px' }}
            >
              매장명: 배재대 베이커리
            </p>
            <div style={{ marginBottom: '10px' }}>
              <span
                style={{
                  textDecoration: 'line-through',
                  color: '#aaa',
                  marginRight: '5px',
                }}
              >
                15,000원
              </span>
              <strong style={{ color: '#FF4500', fontSize: '18px' }}>
                7,000원
              </strong>
            </div>
            <p style={{ fontWeight: 'bold', color: '#008000' }}>
              남은 수량: 2개
            </p>
            <button
              onClick={() => openMap('배재대학교')}
              style={{
                width: '100%',
                padding: '8px',
                backgroundColor: '#8B4513',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                marginTop: '10px',
                cursor: 'pointer',
              }}
            >
              매장 위치 보기
            </button>
          </div>
        </div>
      </div>

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
            <h3 style={{ margin: '0 0 15px 0' }}>
              📍 {selectedStore} 위치 안내
            </h3>
            <iframe
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '8px' }}
              loading="lazy"
              allowFullScreen
              src={`http://googleusercontent.com/maps.google.com/maps?q=${encodeURIComponent(selectedStore + ' 대전')}&t=&z=16&ie=UTF-8&iwloc=&output=embed`}
            ></iframe>
            <button
              onClick={() => setIsOpenMap(false)}
              style={{
                marginTop: '15px',
                padding: '10px 20px',
                backgroundColor: '#333',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer',
                width: '100%',
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
