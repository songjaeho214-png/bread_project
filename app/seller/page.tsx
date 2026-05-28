'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

interface BreadItem {
  id: string;
  name: string;
  original_price: number;
  discount_price: number;
  count: number;
}

export default function SellerDashboard() {
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState(''); // 🏢 매장 주소 상태 추가
  const [isStoreRegistered, setIsStoreRegistered] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);

  const [breadList, setBreadList] = useState<BreadItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');

  // 1. 로그인한 사장님의 매장 정보가 이미 Supabase에 있는지 확인
  useEffect(() => {
    async function loadStoreAndBreads() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (storeData) {
        setStoreName(storeData.name);
        setStoreAddress(storeData.address || ''); // 저장된 주소 가져오기
        setStoreId(storeData.id);
        setIsStoreRegistered(true);

        const { data: breadData } = await supabase
          .from('breads')
          .select('*')
          .eq('store_id', storeData.id);

        if (breadData) setBreadList(breadData);
      }
    }
    loadStoreAndBreads();
  }, []);

  // 2. 매장 이름 및 주소 등록/수정 함수
  const handleRegisterStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return alert('매장 이름을 입력하세요!');
    if (!storeAddress.trim()) return alert('매장의 실제 주소를 입력하세요!'); // 주소 검증

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert('로그인이 필요합니다.');

    if (!isStoreRegistered) {
      // 신규 매장 등록 (주소 포함)
      const { data, error } = await supabase
        .from('stores')
        .insert([{ name: storeName, address: storeAddress, user_id: user.id }])
        .select()
        .single();

      if (error) return alert('매장 등록 실패: ' + error.message);
      setStoreId(data.id);
      setIsStoreRegistered(true);
      alert('🎉 매장 등록 성공! 이제 아래에서 마감 빵을 등록해 주세요.');
    } else {
      // 기존 매장 이름 및 주소 수정
      const { error } = await supabase
        .from('stores')
        .update({ name: storeName, address: storeAddress })
        .eq('id', storeId);

      if (error) return alert('매장 정보 수정 실패: ' + error.message);
      alert('📝 매장 정보(이름/주소)가 수정되었습니다.');
    }
  };

  // 3. 새로운 마감 빵 등록 함수
  const handleAddBread = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeId) return alert('먼저 매장 정보를 등록해 주세요!');
    if (!newName || !newOriginalPrice || !newDiscountPrice)
      return alert('빵 정보를 모두 입력하세요!');

    const { data, error } = await supabase
      .from('breads')
      .insert([
        {
          store_id: storeId,
          name: newName,
          original_price: Number(newOriginalPrice),
          discount_price: Number(newDiscountPrice),
          count: 1,
        },
      ])
      .select()
      .single();

    if (error) return alert('빵 등록 실패: ' + error.message);

    setBreadList([...breadList, data]);
    setNewName('');
    setNewOriginalPrice('');
    setNewDiscountPrice('');
    alert(`🍞 [${newName}] 등록 완료!`);
  };

  const changeCount = async (
    id: string,
    currentCount: number,
    delta: number,
  ) => {
    const nextCount = currentCount + delta;
    if (nextCount < 0) return;

    const { error } = await supabase
      .from('breads')
      .update({ count: nextCount })
      .eq('id', id);
    if (error) return alert('수량 업데이트 실패');

    setBreadList(
      breadList.map((b) => (b.id === id ? { ...b, count: nextCount } : b)),
    );
  };

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        backgroundColor: '#FDFBF7',
        minHeight: '100vh',
      }}
    >
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
      </div>

      <div style={{ padding: '20px' }}>
        {/* 매장 이름 & 주소 설정 칸 */}
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
            style={{ margin: '0 0 10px 0', fontSize: '15px', color: '#8B4513' }}
          >
            🏢 매장 프로필 설정
          </h3>
          <form
            onSubmit={handleRegisterStore}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <input
              type="text"
              placeholder="우리 매장 이름 (예: 대전 대박빵집)"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                color: '#000',
              }}
            />
            <input
              type="text"
              placeholder="매장 실제 주소 (예: 대전 서구 도마동 123-4)"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                color: '#000',
              }}
            />
            <button
              type="submit"
              style={{
                backgroundColor: '#8B4513',
                color: 'white',
                border: 'none',
                padding: '10px',
                borderRadius: '4px',
                fontWeight: 'bold',
                cursor: 'pointer',
              }}
            >
              {isStoreRegistered ? '매장 정보 수정' : '매장 정보 등록'}
            </button>
          </form>
        </div>

        {/* 빵 추가 칸 */}
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
            ✨ 오늘 마감 빵 추가
          </h3>
          <form
            onSubmit={handleAddBread}
            style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
          >
            <input
              type="text"
              placeholder="빵 이름"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              style={{
                padding: '8px',
                borderRadius: '4px',
                border: '1px solid #ccc',
                color: '#000',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <input
                type="number"
                placeholder="정가"
                value={newOriginalPrice}
                onChange={(e) => setNewOriginalPrice(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  color: '#000',
                }}
              />
              <input
                type="number"
                placeholder="할인가"
                value={newDiscountPrice}
                onChange={(e) => setNewDiscountPrice(e.target.value)}
                style={{
                  flex: 1,
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  color: '#000',
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
              ➕ 마감 빵 등록하기
            </button>
          </form>
        </div>

        {/* 현황 리스트 */}
        <h3 style={{ margin: '0 0 15px 0', fontSize: '15px', color: '#333' }}>
          🥐 우리 매장 등록 현황
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
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <h4
                    style={{
                      margin: '0 0 5px 0',
                      fontSize: '16px',
                      color: '#000',
                    }}
                  >
                    {bread.name}
                  </h4>
                  <span style={{ fontSize: '13px', color: '#666' }}>
                    {bread.original_price}원 ➡️{' '}
                    <strong style={{ color: '#8B4513' }}>
                      {bread.discount_price}원
                    </strong>
                  </span>
                </div>
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
                    onClick={() => changeCount(bread.id, bread.count, -1)}
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
                      color: '#000',
                    }}
                  >
                    {bread.count}개
                  </span>
                  <button
                    onClick={() => changeCount(bread.id, bread.count, 1)}
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
