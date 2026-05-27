'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function WelcomeLoginPage() {
  const [role, setRole] = useState<'user' | 'seller'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      const userRole = data.user?.user_metadata?.role;

      if (userRole !== role) {
        alert(
          `로그인 실패: 해당 계정은 ${role === 'user' ? '매장' : '소비자'} 계정입니다. 탭을 올바르게 선택해 주세요.`,
        );
        await supabase.auth.signOut();
        return;
      }

      if (role === 'user') {
        alert('소비자 로그인 성공! 오늘 우리동네 마감 빵을 확인하세요.');
        router.push('/home');
      } else {
        alert('사장님 로그인 성공! 판매자 대시보드로 이동합니다.');
        router.push('/seller');
      }
    } catch (error: any) {
      console.error(error);
      alert('로그인 실패: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        padding: '60px 20px',
        fontFamily: 'sans-serif',
        display: 'flex',
        justifyContent: 'center',
        backgroundColor: '#FDFBF7',
        minHeight: '80vh',
      }}
    >
      {/* 힌트 텍스트(placeholder) 색상을 강제로 진한 검은색 계열로 바꾸는 CSS */}
      <style>{`
        input::placeholder {
          color: #333333 !important;
          opacity: 1 !important;
        }
      `}</style>

      <div
        style={{
          border: '1px solid #ced4da',
          padding: '4px 30px 30px 30px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '380px',
          backgroundColor: 'white',
          boxShadow: '0 6px 12px rgba(0,0,0,0.05)',
        }}
      >
        <div style={{ textAlign: 'center', margin: '30px 0 20px 0' }}>
          <span style={{ fontSize: '40px' }}>🍞</span>
          <h2 style={{ color: '#8B4513', margin: '10px 0 5px 0' }}>
            빵과 사는 남자들
          </h2>
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            지구를 살리는 우리동네 마감 빵 순환 서비스
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            borderRadius: '8px',
            backgroundColor: '#eee',
            padding: '4px',
            marginBottom: '25px',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('user')}
            style={{
              flex: 1,
              padding: '10px 5px', // 양옆 여백을 살짝 줄여서 글씨 공간 확보
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: role === 'user' ? '#8B4513' : 'transparent',
              color: role === 'user' ? '#FFFFFF' : '#666',
              fontSize: '13px', // 글자 크기를 14px에서 13px로 미세 조정
              whiteSpace: 'nowrap', // 어떤 일이 있어도 줄바꿈 금지 명령어
            }}
          >
            🙋‍♂️ 소비자 로그인
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            style={{
              flex: 1,
              padding: '10px 5px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: role === 'seller' ? '#8B4513' : 'transparent',
              color: role === 'seller' ? '#FFFFFF' : '#666',
              fontSize: '13px',
              whiteSpace: 'nowrap', // 어떤 일이 있어도 줄바꿈 금지 명령어
            }}
          >
            👩‍🍳 매장 로그인
          </button>
        </div>

        <form
          onSubmit={handleLogin}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000' }}
            >
              이메일 주소
            </label>
            <input
              type="email"
              placeholder="이메일을 입력하세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{
                padding: '11px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                color: '#000000',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000' }}
            >
              비밀번호
            </label>
            <input
              type="password"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                padding: '11px',
                borderRadius: '6px',
                border: '1px solid #ccc',
                color: '#000000',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '13px',
              backgroundColor: '#8B4513',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '15px',
              fontWeight: 'bold',
              cursor: 'pointer',
              marginTop: '10px',
            }}
          >
            {isLoading ? '로그인 중...' : '로그인하기'}
          </button>
        </form>

        <p
          style={{
            textAlign: 'center',
            marginTop: '20px',
            fontSize: '14px',
            color: '#000000',
          }}
        >
          처음 오셨나요?{' '}
          <Link
            href="/signup"
            style={{
              color: '#8B4513',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            회원가입하러 가기
          </Link>
        </p>
      </div>
    </div>
  );
}
