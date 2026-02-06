-- =============================================
-- 커리큘럼 데이터 삽입을 위한 RLS 임시 비활성화
-- Supabase SQL Editor에서 실행하세요
-- =============================================

-- RLS 비활성화 (데이터 삽입용)
ALTER TABLE units DISABLE ROW LEVEL SECURITY;
ALTER TABLE unit_contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes DISABLE ROW LEVEL SECURITY;
ALTER TABLE levels DISABLE ROW LEVEL SECURITY;

-- 확인 메시지
SELECT 'RLS disabled for curriculum tables. Run the seed script now!' as message;
