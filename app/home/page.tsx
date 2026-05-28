'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

interface Store {
  id: string;
  name: string;
  address: string;
}

interface Review {
  id: string;
  content: string;
  created_at: string;
}

export default function HomePage() {
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // 모달 상태 관리
  const [isOpenMap, setIsOpenMap] = useState(false);
  const [selectedStoreName, setSelectedStoreName] = useState('');
  const [selectedStoreAddress, setSelectedStoreAddress] = useState('');

  const [isOpenReviewInput, setIsOpenReviewInput] = useState(false);
  const [isOpenReviewList, setIsOpenReviewList] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [reviewContent, setReviewContent] = useState('');
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    async function checkAuthAndFetchStores() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('로그인이 필요한 페이지입니다.');
        router.push('/');
        return;
      }
      setCurrentUserId(user.id);

      try {
        const { data, error } = await supabase
          .from('stores')
          .select('id, name, address');
        if (error) throw error;
        if (data) setStores(data);
      } catch (err) {
        console.error('매장 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuthAndFetchStores();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    alert('로그아웃되었습니다.');
    router.push('/');
  };

  const openMap = (e: React.MouseEvent, name: string, address: string) => {
    e.stopPropagation();
    setSelectedStoreName(name);
    setSelectedStoreAddress(address || name);
    setIsOpenMap(true);
  };

  // 📝 리뷰 남기기 창 열기
  const openReviewInput = (
    e: React.MouseEvent,
    storeId: string,
    storeName: string,
  ) => {
    e.stopPropagation();
    setSelectedStoreId(storeId);
    setSelectedStoreName(storeName);
    setReviewContent('');
    setIsOpenReviewInput(true);
  };

  // 📝 리뷰 저장하기
  const handleSaveReview = async () => {
    if (!reviewContent.trim()) {
      alert('리뷰 내용을 입력해주세요!');
      return;
    }
    try {
      const { error } = await supabase.from('reviews').insert([
        {
          store_id: selectedStoreId,
          user_id: currentUserId,
          content: reviewContent,
        },
      ]);
      if (error) throw error;
      alert('리뷰가 성공적으로 등록되었습니다!');
      setIsOpenReviewInput(false);
    } catch (err) {
      console.error('리뷰 등록 실패:', err);
      alert('리뷰 등록 중 오류가 발생했습니다.');
    }
  };

  // 👀 리뷰 보기 창 열기 (해당 매장의 리뷰들 긁어오기)
  const openReviewList = async (
    e: React.MouseEvent,
    storeId: string,
    storeName: string,
  ) => {
    e.stopPropagation();
    setSelectedStoreId(storeId);
    setSelectedStoreName(storeName);
    setIsOpenReviewList(true);

    try {
      const { data, error } = await supabase
        .from('reviews')
        .select('id, content, created_at')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      setReviews(data || []);
    } catch (err) {
      console.error('리뷰 로딩 실패:', err);
    }
  };

  return (
    <div
      style={{ backgroundColor: '#FDFBF7', minHeight: '100vh', color: '#000' }}
    >
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '24px' }}>🍞</span>
          <span style={{ fontSize: '20px', fontWeight: 'bold' }}>
            빵과 사는 남자들 (소비자용)
          </span>
        </div>
        <button
          onClick={handleLogout}
          style={{
            color: 'white',
            border: 'none',
            fontWeight: 'bold',
            backgroundColor: 'rgba(255,255,255,0.2)',
            padding: '6px 12px',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          🚪 로그아웃
        </button>
      </nav>

      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#8B4513', fontSize: '22px' }}>
          🥖 오늘의 우리동네 마감 빵 매장
        </h1>
        <p style={{ color: '#666', marginBottom: '20px' }}>
          매장을 선택하면 오늘 남은 마감 빵 목록을 볼 수 있습니다.
        </p>
        <hr
          style={{ margin: '20px 0', border: '0', borderTop: '1px solid #ddd' }}
        />

        <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
          {isLoading ? (
            <p>인증 확인 및 매장 정보를 불러오는 중...</p>
          ) : stores.length === 0 ? (
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
            </div>
          ) : (
            stores.map((store) => (
              <div
                key={store.id}
                onClick={() => router.push(`/home/store/${store.id}`)}
                style={{
                  border: '1px solid #ddd',
                  padding: '20px',
                  borderRadius: '12px',
                  width: '280px',
                  backgroundColor: 'white',
                  cursor: 'pointer',
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
                  <h3 style={{ margin: 0, fontSize: '18px', color: '#000' }}>
                    {store.name}
                  </h3>
                </div>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#666',
                    margin: '0 0 15px 0',
                  }}
                >
                  📍 {store.address || '주소 미등록 매장'}
                </p>

                {/* 🆕 요구사항: 주소와 위치 보기 사이에 리뷰 버튼 2개 추가 */}
                <div
                  style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}
                >
                  <button
                    onClick={(e) => openReviewInput(e, store.id, store.name)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#E6F4EA',
                      color: '#137333',
                      border: '1px solid #137333',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                  >
                    📝 리뷰 남기기
                  </button>
                  <button
                    onClick={(e) => openReviewList(e, store.id, store.name)}
                    style={{
                      flex: 1,
                      padding: '8px',
                      backgroundColor: '#E8F0FE',
                      color: '#1A73E8',
                      border: '1px solid #1A73E8',
                      borderRadius: '5px',
                      cursor: 'pointer',
                      fontWeight: 'bold',
                      fontSize: '12px',
                    }}
                  >
                    👀 리뷰 보기
                  </button>
                </div>

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

      {/* 🗺️ 1. 지도 모달 */}
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
            <iframe
              width="100%"
              height="350"
              style={{ border: 0, borderRadius: '8px' }}
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(selectedStoreAddress)}&t=&z=16&ie=UTF-8&iwloc=&output=embed`}
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

      {/* 📝 2. 리뷰 작성 모달 */}
      {isOpenReviewInput && (
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
              maxWidth: '400px',
            }}
          >
            <h3
              style={{
                margin: '0 0 15px 0',
                color: '#8B4513',
                textAlign: 'center',
              }}
            >
              ✏️ {selectedStoreName} 리뷰 작성
            </h3>
            <textarea
              value={reviewContent}
              onChange={(e) => setReviewContent(e.target.value)}
              placeholder="매장과 마감 빵에 대한 솔직한 리뷰를 남겨주세요!"
              style={{
                width: '100%',
                height: '100px',
                padding: '10px',
                borderRadius: '6px',
                border: '1px solid #ddd',
                resize: 'none',
                boxSizing: 'border-box',
                marginBottom: '15px',
                color: '#000',
              }}
            />
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setIsOpenReviewInput(false)}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#bbb',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                취소
              </button>
              <button
                onClick={handleSaveReview}
                style={{
                  flex: 1,
                  padding: '10px',
                  backgroundColor: '#137333',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                등록하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 👀 3. 리뷰 목록 조회 모달 */}
      {isOpenReviewList && (
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
              maxWidth: '450px',
            }}
          >
            <h3
              style={{
                margin: '0 0 15px 0',
                color: '#1A73E8',
                textAlign: 'center',
              }}
            >
              💬 {selectedStoreName} 리뷰 목록
            </h3>
            <div
              style={{
                maxHeight: '250px',
                overflowY: 'auto',
                marginBottom: '15px',
                borderTop: '1px solid #eee',
              }}
            >
              {reviews.length === 0 ? (
                <p
                  style={{
                    textAlign: 'center',
                    color: '#999',
                    padding: '20px 0',
                  }}
                >
                  아직 등록된 리뷰가 없습니다. 첫 리뷰를 작성해 보세요!
                </p>
              ) : (
                reviews.map((rev) => (
                  <div
                    key={rev.id}
                    style={{
                      padding: '12px 5px',
                      borderBottom: '1px solid #eee',
                    }}
                  >
                    <p
                      style={{
                        margin: '0 0 5px 0',
                        fontSize: '14px',
                        color: '#333',
                        lineHeight: '1.4',
                      }}
                    >
                      {rev.content}
                    </p>
                    <span style={{ fontSize: '11px', color: '#999' }}>
                      {new Date(rev.created_at).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setIsOpenReviewList(false)}
              style={{
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
