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
          <span style={{ fontSize: '40px' }}>📝</span>
          <h2 style={{ color: '#2E7D32', margin: '10px 0 5px 0' }}>
            신규 회원가입
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
              padding: '10px 5px',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: 'bold',
              backgroundColor: role === 'user' ? '#2E7D32' : 'transparent',
              color: role === 'user' ? '#FFF' : '#666',
              fontSize: '13px',
              whiteSpace: 'nowrap', // 어떤 일이 있어도 줄바꿈 금지 명령어
            }}
          >
            🙋‍♂️ 소비자 가입
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
              backgroundColor: role === 'seller' ? '#2E7D32' : 'transparent',
              color: role === 'seller' ? '#FFF' : '#666',
              fontSize: '13px',
              whiteSpace: 'nowrap', // 어떤 일이 있어도 줄바꿈 금지 명령어
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
              style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000' }}
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
                border: '1px solid #ccc',
                color: '#000000',
              }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
            <label
              style={{ fontSize: '13px', fontWeight: 'bold', color: '#000000' }}
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
              backgroundColor: '#2E7D32',
              color: 'white',
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
          }}
        >
          이미 계정이 있으신가요?{' '}
          <Link
            href="/"
            style={{
              color: '#2E7D32',
              fontWeight: 'bold',
              textDecoration: 'none',
            }}
          >
            로그인하러 가기
          </Link>
        </p>
      </div>
    </div>
  );
}
