import { createClient } from '@supabase/supabase-js';

// .env.local에 저장해둔 열쇠들을 컴퓨터가 자동으로 읽어옵니다.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// 이 두 열쇠를 가지고 수파베이스랑 소통할 '우체부(supabase)'를 고용합니다.
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
