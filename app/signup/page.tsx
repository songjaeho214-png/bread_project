'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function SignupPage() {
  const [role, setRole] = useState<'user' | 'seller'>('user');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: { role: role },
        },
      });

      if (error) throw error;

      alert('🎉 회원가입 성공! 가입하신 정보로 로그인을 진행해 주세요.');
      window.location.href = '/';
    } catch (error: any) {
      console.error(error);
      alert('회원가입 실패: ' + error.message);
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
        backgroundColor: '#E8F5E9',
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
          <span style={{ fontSize: '40px' }}>📝</span>
          <h2
            style={{
              color: '#000000',
              margin: '10px 0 5px 0',
              fontWeight: 'bold',
            }}
          >
            신규 회원가입
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
            🙋‍♂️ 소비자 가입
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
            👩‍🍳 매장 가입
          </button>
        </div>

        <form
          onSubmit={handleSignup}
          style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              style={{ fontSize: '14px', fontWeight: 'bold', color: '#000000' }}
            >
              새 이메일 주소
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
              새 비밀번호 (6자리 이상)
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
            {isLoading ? '가입 계정 생성 중...' : '정식 회원가입 완료하기'}
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
          이미 계정이 있으신가요?{' '}
          <Link
            href="/"
            style={{
              color: '#000000',
              fontWeight: 'black',
              textDecoration: 'underline',
            }}
          >
            로그인하러 가기
          </Link>
        </p>
      </div>
    </div>
  );
}
