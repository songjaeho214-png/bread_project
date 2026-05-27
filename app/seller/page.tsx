'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SellerPage() {
  const [quantity, setQuantity] = useState(5);
  const [isSaving, setIsSaving] = useState(false);

  const handleIncrease = () => setQuantity((prev) => prev + 1);
  const handleDecrease = () => setQuantity((prev) => (prev > 0 ? prev - 1 : 0));

  const handleUpdate = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase.from('closing_items').upsert({
        id: '22222222-2222-2222-2222-222222222222',
        store_id: '11111111-1111-1111-1111-111111111111',
        name: '단팥빵',
        category: '단과자빵',
        original_price: 2500,
        discount_price: 1500,
        quantity: quantity,
        pickup_start: '19:00:00',
        pickup_end: '21:00:00',
        is_randombox: false,
      });

      if (error) throw error;
      alert('수파베이스 DB 연동 성공! 재고가 저장되었습니다.');
    } catch (error: any) {
      console.error(error);
      alert('DB 저장 실패: ' + error.message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      {/* 🟤 매장 사장님 전용 상단바 */}
      <nav
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '15px 30px',
          backgroundColor: '#5C2E0B',
          color: 'white',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>👩‍🍳</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            빵과 사는 남자들 (파트너 시스템)
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
        <h1 style={{ color: '#8B4513' }}>🍞 판매자 대시보드</h1>
        <p>도마동 사장님, 환영합니다! 오늘 남은 마감 빵을 관리하세요.</p>
        <hr style={{ margin: '20px 0' }} />

        <div
          style={{
            border: '1px solid #ddd',
            padding: '15px',
            borderRadius: '8px',
            maxWidth: '450px',
            backgroundColor: 'white',
          }}
        >
          <h3 style={{ margin: '0 0 15px 0' }}>🥐 오늘의 마감 빵 등록</h3>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '10px',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                단팥빵
              </span>
              <span
                style={{ color: '#666', fontSize: '13px', marginTop: '4px' }}
              >
                정가: 2,500원 / 할인가: 1,500원
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #ccc',
                borderRadius: '5px',
                overflow: 'hidden',
              }}
            >
              <button
                onClick={handleDecrease}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                -
              </button>
              <span
                style={{
                  minWidth: '40px',
                  textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: '16px',
                }}
              >
                {quantity}개
              </span>
              <button
                onClick={handleIncrease}
                style={{
                  padding: '8px 12px',
                  border: 'none',
                  backgroundColor: '#f5f5f5',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                +
              </button>
            </div>
          </div>

          <button
            onClick={handleUpdate}
            disabled={isSaving}
            style={{
              marginTop: '20px',
              width: '100%',
              padding: '12px',
              backgroundColor: isSaving ? '#aaa' : '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: isSaving ? 'not-allowed' : 'pointer',
            }}
          >
            {isSaving ? '수파베이스에 저장 중...' : '재고 현황 업데이트하기'}
          </button>
        </div>
      </div>
    </div>
  );
}
