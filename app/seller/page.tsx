'use client';

import { useState } from 'react';

// 빵 한 개당 들어갈 데이터 양식 정의
interface BreadItem {
  id: number;
  name: string;
  originalPrice: number;
  discountPrice: number;
  count: number;
}

export default function SellerDashboard() {
  // 기본값으로 단팥빵 하나 넣어두고, 사장님이 추가할 수 있게 배열(State)로 관리
  const [breadList, setBreadList] = useState<BreadItem[]>([
    {
      id: 1,
      name: '단팥빵',
      originalPrice: 2500,
      discountPrice: 1500,
      count: 5,
    },
  ]);

  // 새로운 빵 입력값을 저장하는 변수들
  const [newName, setNewName] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');

  // 1. 새로운 빵 리스트에 추가하는 함수
  const handleAddBread = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newOriginalPrice || !newDiscountPrice) {
      alert('빵 정보를 모두 입력해 주세요!');
      return;
    }

    const newBread: BreadItem = {
      id: Date.now(), // 겹치지 않는 고유 ID 생성
      name: newName,
      originalPrice: Number(newOriginalPrice),
      discountPrice: Number(newDiscountPrice),
      count: 1, // 처음 추가할 때 기본 1개
    };

    setBreadList([...breadList, newBread]);

    // 입력창 비우기
    setNewName('');
    setNewOriginalPrice('');
    setNewDiscountPrice('');
  };

  // 2. 수량 변경 함수 (+ / - 버튼 작동)
  const changeCount = (id: number, delta: number) => {
    setBreadList(
      breadList.map((bread) => {
        if (bread.id === id) {
          const nextCount = bread.count + delta;
          return { ...bread, count: nextCount < 0 ? 0 : nextCount }; // 0개 미만으로 안 내려가게 방지
        }
        return bread;
      }),
    );
  };

  // 3. 재고 업데이트 버튼 함수
  const handleUpdateStock = (name: string, count: number) => {
    alert(`🎉 [${name}] 재고가 ${count}개로 업데이트 되었습니다!`);
    // 실제 Supabase DB 연동이 필요하다면 여기에 코드를 작성하면 돼!
  };

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        backgroundColor: '#FDFBF7',
        minHeight: '100vh',
      }}
    >
      {/* 상단 바 */}
      <div
        style={{
          backgroundColor: '#8B4513',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1
          style={{
            color: 'white',
            margin: 0,
            fontSize: '18px',
            fontWeight: 'bold',
          }}
        >
          👩‍🍳 빵과 사는 남자들 (파트너 시스템)
        </h1>
        <button
          style={{
            backgroundColor: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: 'none',
            padding: '6px 12px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          로그아웃
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        <p
          style={{
            margin: '0 0 5px 0',
            color: '#8B4513',
            fontWeight: 'bold',
            fontSize: '14px',
          }}
        >
          📦 판매자 대시보드
        </p>
        <h2 style={{ margin: '0 0 25px 0', fontSize: '16px', color: '#333' }}>
          도마동 사장님, 환영합니다! 오늘 남은 마감 빵을 관리하세요.
        </h2>

        {/* --- 새로운 빵 추가 폼 (여기가 새로 만든 공간이야!) --- */}
        <div
          style={{
            backgroundColor: 'white',
            border: '1px solid #ced4da',
            borderRadius: '8px',
            padding: '15px',
            marginBottom: '25px',
            maxWidth: '500px',
          }}
        >
          <h3
            style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#8B4513' }}
          >
            ✨ 오늘 새로운 마감 빵 추가하기
          </h3>
          <form
            onSubmit={handleAddBread}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <input
              type="text"
              placeholder="빵 이름 (예: 소금빵)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                placeholder="정가 (원)"
                value={newOriginalPrice}
                onChange={(e) => setNewOriginalPrice(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
              <input
                type="number"
                placeholder="할인가 (원)"
                value={newDiscountPrice}
                onChange={(e) => setNewDiscountPrice(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                }}
              />
            </div>
            <button
              type="submit"
              style={{
                backgroundColor: '#2E7D32',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              ➕ 새로운 마감 빵 등록
            </button>
          </form>
        </div>

        {/* --- 등록된 마감 빵 리스트 --- */}
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#333' }}>
          🥐 오늘의 마감 빵 등록 현황
        </h3>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '15px',
            maxWidth: '400px',
          }}
        >
          {breadList.map((bread) => (
            <div
              key={bread.id}
              style={{
                backgroundColor: 'white',
                border: '1px solid #ced4da',
                padding: '15px',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '15px',
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: '0 0 5px 0',
                      fontSize: '16px',
                      color: '#000000',
                    }}
                  >
                    {bread.name}
                  </h4>
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    정가: {bread.originalPrice.toLocaleString()}원 / 할인가:{' '}
                    <strong style={{ color: '#8B4513' }}>
                      {bread.discountPrice.toLocaleString()}원
                    </strong>
                  </span>
                </div>

                {/* 수량 조절 버튼 */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    border: '1px solid #ccc',
                    borderRadius: '4px',
                    backgroundColor: '#eee',
                  }}
                >
                  <button
                    onClick={() => changeCount(bread.id, -1)}
                    style={{
                      border: 'none',
                      padding: '5px 10px',
                      background: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    -
                  </button>
                  <span
                    style={{
                      padding: '0 10px',
                      backgroundColor: 'white',
                      fontWeight: 'bold',
                      minWidth: '30px',
                      textAlign: 'center',
                    }}
                  >
                    {bread.count}개
                  </span>
                  <button
                    onClick={() => changeCount(bread.id, 1)}
                    style={{
                      border: 'none',
                      padding: '5px 10px',
                      background: 'none',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleUpdateStock(bread.name, bread.count)}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: '#8B4513',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                }}
              >
                재고 현황 업데이트하기
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
