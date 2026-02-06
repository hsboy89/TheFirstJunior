import { createClient } from '@supabase/supabase-js';

// 환경 변수 로드
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Vercel 빌드 시 환경 변수가 없을 경우를 대비한 예외 처리
// (실제 런타임에는 환경 변수가 있어야 정상 작동함)
const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder';

export const supabase = createClient(url, key);

// Types for database tables
export interface Level {
    id: number;
    grade_name: string;
    description: string;
    required_xp: number;
}

export interface Profile {
    id: string;
    username: string;
    level_id: number;
    total_xp: number;
    created_at: string;
}

export interface Unit {
    id: number;
    level_id: number;
    module_no: number;
    title: string;
    order_no: number;
}

export interface UnitContent {
    id: number;
    unit_id: number;
    reading_text: string;
    vocab: VocabItem[];
    grammar: GrammarItem;
}

export interface VocabItem {
    word: string;
    meaning: string;
    example: string;
}

export interface GrammarItem {
    title: string;
    explanation: string;
    examples: string[];
}

export interface Quiz {
    id: number;
    unit_id: number;
    question: string;
    options: string[];
    answer: string;
}

export interface UserProgress {
    id: number;
    profile_id: string;
    unit_id: number;
    score: number;
    completed_at: string | null;
}
