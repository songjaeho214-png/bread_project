import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '빵과 사는 남자들 - 마감 빵 자원순환 서비스',
  description: '우리 동네 빵집의 맛있는 마감 빵을 저렴하게 구출하세요!',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body style={{ margin: 0, padding: 0, backgroundColor: '#FDFBF7' }}>
        {/* 상단바를 여기 서 제거하고 각 페이지 내부로 이동시킵니다 */}
        <main>{children}</main>
      </body>
    </html>
  );
}
