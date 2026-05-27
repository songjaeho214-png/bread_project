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
      <div
        style={{
          border: '3px solid #000000',
          padding: '4px 30px 30px 30px',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '380px',
          backgroundColor: 'white',
          boxShadow: '0 6px 12px rgba(0,0,0,0.15)',
        }}
      >
        <div style={{ textAlign: 'center', margin: '30px 0 20px 0' }}>
          <span style={{ fontSize: '40px' }}>🍞</span>
          <h2
            style={{
              color: '#000000',
              margin: '10px 0 5px 0',
              fontWeight: 'bold',
            }}
          >
            빵과 사는 남자들
          </h2>
          <p
            style={{
              color: '#000000',
              fontSize: '14px',
              margin: 0,
              fontWeight: 'bold',
            }}
          >
            지구를 살리는 우리동네 마감 빵 순환 서비스
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            borderRadius: '8px',
            backgroundColor: '#EAEAEA',
            padding: '4px',
            marginBottom: '25px',
            border: '1px solid #000000',
          }}
        >
          <button
            type="button"
            onClick={() => setRole('user')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: role === 'user' ? '#000000' : 'transparent',
              color: role === 'user' ? '#FFFFFF' : '#000000',
              fontSize: '14px',
            }}
          >
            🙋‍♂️ 소비자 로그인
          </button>
          <button
            type="button"
            onClick={() => setRole('seller')}
            style={{
              flex: 1,
              padding: '10px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: role === 'seller' ? '#000000' : 'transparent',
              color: role === 'seller' ? '#FFFFFF' : '#000000',
              fontSize: '14px',
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
              style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}
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
                border: '2px solid #000000',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}
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
                border: '2px solid #000000',
                color: '#000000',
                fontSize: '14px',
                fontWeight: 'bold',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            style={{
              padding: '13px',
              backgroundColor: '#000000',
              color: '#FFFFFF',
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
            fontWeight: 'bold',
          }}
        >
          처음 오셨나요?{' '}
          <Link
            href="/signup"
            style={{
              color: '#000000',
              fontWeight: 'black',
              textDecoration: 'underline',
            }}
          >
            회원가입하러 가기
          </Link>
        </p>
      </div>
    </div>
  );
}
