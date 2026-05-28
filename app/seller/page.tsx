'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface BreadItem {
  id: string;
  name: string;
  original_price: number;
  discount_price: number;
  count: number;
}

export default function SellerDashboard() {
  const router = useRouter();
  const [storeName, setStoreName] = useState('');
  const [storeAddress, setStoreAddress] = useState('');
  const [isStoreRegistered, setIsStoreRegistered] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);

  const [breadList, setBreadList] = useState<BreadItem[]>([]);
  const [newName, setNewName] = useState('');
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newDiscountPrice, setNewDiscountPrice] = useState('');

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true); // 💡 세션 로딩 상태 추가

  const loadStoreAndBreads = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // 💡 비로그인 유저가 억지로 들어오면 메인으로 쫓아냄
      if (!user) {
        alert('접근 권한이 없습니다. 로그인을 먼저 진행해 주세요!');
        router.push('/');
        return;
      }

      const { data: storeData } = await supabase
        .from('stores')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (storeData) {
        setStoreName(storeData.name);
        setStoreAddress(storeData.address || '');
        setStoreId(storeData.id);
        setIsStoreRegistered(true);
        setIsEditMode(false);

        const { data: breadData } = await supabase
          .from('breads')
          .select('*')
          .eq('store_id', storeData.id);

        if (breadData) setBreadList(breadData);
      } else {
        setStoreName('');
        setStoreAddress('');
        setStoreId(null);
        setIsStoreRegistered(false);
        setIsEditMode(true);
        setBreadList([]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAuthLoading(false); // 💡 검사 끝났으니 화면 켜기
    }
  };

  useEffect(() => {
    loadStoreAndBreads();
  }, []);

  // 💡 진짜 로그아웃 기능 수행 함수
  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('정상적으로 로그아웃되었습니다.');
    router.push('/');
  };

  const handleRegisterStore = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName.trim()) return alert('매장 이름을 입력하세요!');
    if (!storeAddress.trim()) return alert('매장의 실제 주소를 입력하세요!');

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return alert('로그인이 필요합니다.');

    if (!isStoreRegistered) {
      const { data, error } = await supabase
        .from('stores')
        .insert([{ name: storeName, address: storeAddress, user_id: user.id }])
        .select()
        .single();

      if (error) return alert('매장 등록 실패: ' + error.message);
      setStoreId(data.id);
      setIsStoreRegistered(true);
      setIsEditMode(false);
      alert('🎉 매장 등록 성공! 이제 아래에서 마감 빵을 등록해 주세요.');
    } else {
      const { error } = await supabase
        .from('stores')
        .update({ name: storeName, address: storeAddress })
        .eq('id', storeId);

      if (error) return alert('매장 정보 수정 실패: ' + error.message);
      setIsEditMode(false);
      alert('📝 매장 정보(이름/주소)가 수정되었습니다.');
    }
  };

  const handleDeleteStore = async () => {
    if (!storeId) return;

    const confirmDelete = confirm(
      '⚠️ 경고: 매장 등록을 취소하시면 등록된 모든 마감 빵 목록도 함께 완전히 삭제됩니다.\n정말 취소하시겠습니까?',
    );
    if (!confirmDelete) return;

    await supabase.from('breads').delete().eq('store_id', storeId);
    const { error } = await supabase.from('stores').delete().eq('id', storeId);

    if (error) return alert('매장 등록 취소 실패: ' + error.message);

    alert('🗑️ 매장 등록이 정상적으로 취소되었습니다.');
    loadStoreAndBreads();
  };

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

  const handleDeleteBread = async (id: string, name: string) => {
    if (!confirm(`[${name}]을(를) 정말 목록에서 삭제하시겠습니까?`)) return;

    const { error } = await supabase.from('breads').delete().eq('id', id);
    if (error) return alert('빵 삭제 실패: ' + error.message);

    setBreadList(breadList.filter((b) => b.id !== id));
    alert('🗑️ 정상적으로 삭제되었습니다.');
  };

  // 💡 사장님 세션 체크 중일 때는 로딩 문구 가림막 작동
  if (isAuthLoading) {
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
        사장님 계정 인증 확인 중... 👩‍🍳
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        backgroundColor: '#FDFBF7',
        minHeight: '100vh',
        color: '#000',
      }}
    >
      {/* 상단바 */}
      <div
        style={{
          backgroundColor: '#8B4513',
          padding: '15px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
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
          onClick={handleLogout}
          style={{
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '5px',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          🚪 로그아웃
        </button>
      </div>

      <div style={{ padding: '20px' }}>
        {/* 매장 프로필 구역 */}
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
          {isStoreRegistered && !isEditMode ? (
            <div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '10px',
                }}
              >
                <h3
                  style={{
                    margin: 0,
                    fontSize: '16px',
                    color: '#8B4513',
                    fontWeight: 'bold',
                  }}
                >
                  🏪 내 매장 정보
                </h3>
                <span
                  style={{
                    fontSize: '12px',
                    backgroundColor: '#E8F5E9',
                    color: '#2E7D32',
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                  }}
                >
                  온라인 운영중
                </span>
              </div>
              <p
                style={{
                  margin: '5px 0',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  color: '#000',
                }}
              >
                {storeName}
              </p>
              <p
                style={{
                  margin: '5px 0 15px 0',
                  fontSize: '14px',
                  color: '#666',
                }}
              >
                📍 {storeAddress}
              </p>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  style={{
                    flex: 1,
                    backgroundColor: '#F5F5DC',
                    color: '#8B4513',
                    border: '1px solid #8B4513',
                    padding: '8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  ⚙️ 매장 정보 수정
                </button>
                <button
                  type="button"
                  onClick={handleDeleteStore}
                  style={{
                    flex: 1,
                    backgroundColor: '#FFF5F5',
                    color: '#D32F2F',
                    border: '1px solid #D32F2F',
                    padding: '8px',
                    borderRadius: '4px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  🏪 등록 완전히 취소
                </button>
              </div>
            </div>
          ) : (
            <div>
              <h3
                style={{
                  margin: '0 0 10px 0',
                  fontSize: '15px',
                  color: '#8B4513',
                }}
              >
                {isStoreRegistered
                  ? '⚙️ 매장 정보 수정하기'
                  : '🏢 신규 매장 프로필 등록'}
              </h3>
              <form
                onSubmit={handleRegisterStore}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
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
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button
                    type="submit"
                    style={{
                      flex: 2,
                      backgroundColor: '#8B4513',
                      color: 'white',
                      border: 'none',
                      padding: '10px',
                      borderRadius: '4px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                    }}
                  >
                    {isStoreRegistered ? '변경사항 저장' : '매장 등록 완료'}
                  </button>
                  {isStoreRegistered && (
                    <button
                      type="button"
                      onClick={() => setIsEditMode(false)}
                      style={{
                        flex: 1,
                        backgroundColor: '#eee',
                        color: '#333',
                        border: '1px solid #ccc',
                        padding: '10px',
                        borderRadius: '4px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      취소
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
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
          {breadList.length === 0 ? (
            <p style={{ color: '#999', fontSize: '14px', margin: 0 }}>
              등록된 마감 빵이 없습니다.
            </p>
          ) : (
            breadList.map((bread) => (
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
                      flexDirection: 'column',
                      alignItems: 'flex-end',
                      gap: '8px',
                    }}
                  >
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
                          color: '#000',
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
                          color: '#000',
                        }}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => handleDeleteBread(bread.id, bread.name)}
                      style={{
                        backgroundColor: '#e63946',
                        color: 'white',
                        border: 'none',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontSize: '12px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                      }}
                    >
                      ❌ 등록 취소
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
