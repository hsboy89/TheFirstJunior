-- =============================================
-- EduPulse Database Schema
-- Global Leader English Learning Platform
-- =============================================

-- 1. Levels (학년 정보)
CREATE TABLE IF NOT EXISTS levels (
  id SERIAL PRIMARY KEY,
  grade_name VARCHAR(50) NOT NULL,
  description TEXT,
  required_xp INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Profiles (사용자 프로필)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username VARCHAR(100) NOT NULL,
  level_id INTEGER REFERENCES levels(id) DEFAULT 1,
  total_xp INTEGER DEFAULT 0,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Units (유닛 정보 - 90개 유닛)
CREATE TABLE IF NOT EXISTS units (
  id SERIAL PRIMARY KEY,
  level_id INTEGER REFERENCES levels(id),
  module_no INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  order_no INTEGER NOT NULL,
  thumbnail_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Unit Contents (핵심 콘텐츠 - JSONB 활용)
CREATE TABLE IF NOT EXISTS unit_contents (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE UNIQUE,
  reading_text TEXT,
  vocab JSONB DEFAULT '[]'::jsonb,
  grammar JSONB DEFAULT '{}'::jsonb,
  audio_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Quizzes (퀴즈 데이터)
CREATE TABLE IF NOT EXISTS quizzes (
  id SERIAL PRIMARY KEY,
  unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  options JSONB NOT NULL,
  answer VARCHAR(10) NOT NULL,
  explanation TEXT,
  order_no INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. User Progress (학습 진행 기록)
CREATE TABLE IF NOT EXISTS user_progress (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  unit_id INTEGER REFERENCES units(id) ON DELETE CASCADE,
  reading_completed BOOLEAN DEFAULT FALSE,
  vocab_score INTEGER DEFAULT 0,
  grammar_score INTEGER DEFAULT 0,
  quiz_score INTEGER DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, unit_id)
);

-- 7. Achievements/Badges (배지 시스템)
CREATE TABLE IF NOT EXISTS achievements (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  icon_url TEXT,
  xp_reward INTEGER DEFAULT 0,
  condition_type VARCHAR(50),
  condition_value INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. User Achievements (사용자 배지)
CREATE TABLE IF NOT EXISTS user_achievements (
  id SERIAL PRIMARY KEY,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_id INTEGER REFERENCES achievements(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, achievement_id)
);

-- =============================================
-- Indexes for Performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_units_level ON units(level_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_profile ON user_progress(profile_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_unit ON user_progress(unit_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_unit ON quizzes(unit_id);

-- =============================================
-- Initial Data: Levels
-- =============================================
INSERT INTO levels (grade_name, description, required_xp) VALUES
  ('Grade 3', '초등학교 3학년 수준', 0),
  ('Grade 4', '초등학교 4학년 수준', 500),
  ('Grade 5', '초등학교 5학년 수준', 1200),
  ('Grade 6', '초등학교 6학년 수준', 2000),
  ('Grade 7', '중학교 1학년 수준', 3000),
  ('Grade 8', '중학교 2학년 수준', 4500)
ON CONFLICT DO NOTHING;

-- =============================================
-- Sample Achievements
-- =============================================
INSERT INTO achievements (name, description, icon_url, xp_reward, condition_type, condition_value) VALUES
  ('First Steps', '첫 번째 유닛 완료!', '🎯', 50, 'units_completed', 1),
  ('Vocabulary Master', '단어 100개 암기!', '💎', 100, 'vocab_learned', 100),
  ('Quiz Champion', '퀴즈 10개 만점!', '🏆', 150, 'perfect_quizzes', 10),
  ('Adventurer', '10개 유닛 완료!', '🗺️', 200, 'units_completed', 10),
  ('Scholar', '30개 유닛 완료!', '📚', 500, 'units_completed', 30)
ON CONFLICT DO NOTHING;
