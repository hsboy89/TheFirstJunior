-- =============================================
-- Row Level Security (RLS) Policies
-- =============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles but only update their own
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- User Progress: Users can only see and modify their own progress
CREATE POLICY "Users can view their own progress"
  ON user_progress FOR SELECT
  USING (auth.uid() = profile_id);

CREATE POLICY "Users can insert their own progress"
  ON user_progress FOR INSERT
  WITH CHECK (auth.uid() = profile_id);

CREATE POLICY "Users can update their own progress"
  ON user_progress FOR UPDATE
  USING (auth.uid() = profile_id);

-- User Achievements: Users can view their own achievements
CREATE POLICY "Users can view their own achievements"
  ON user_achievements FOR SELECT
  USING (auth.uid() = profile_id);

-- Units, Unit Contents, Quizzes: Public read access
ALTER TABLE units ENABLE ROW LEVEL SECURITY;
ALTER TABLE unit_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Units are viewable by everyone"
  ON units FOR SELECT
  USING (true);

CREATE POLICY "Unit contents are viewable by everyone"
  ON unit_contents FOR SELECT
  USING (true);

CREATE POLICY "Quizzes are viewable by everyone"
  ON quizzes FOR SELECT
  USING (true);

CREATE POLICY "Levels are viewable by everyone"
  ON levels FOR SELECT
  USING (true);

CREATE POLICY "Achievements are viewable by everyone"
  ON achievements FOR SELECT
  USING (true);

-- =============================================
-- Function: Create profile on signup
-- =============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, level_id, total_xp)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    1,
    0
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =============================================
-- Function: Update XP and check level up
-- =============================================
CREATE OR REPLACE FUNCTION public.add_xp(user_id UUID, xp_amount INTEGER)
RETURNS void AS $$
DECLARE
  current_xp INTEGER;
  current_level INTEGER;
  next_level_xp INTEGER;
BEGIN
  -- Get current XP and level
  SELECT total_xp, level_id INTO current_xp, current_level
  FROM profiles WHERE id = user_id;
  
  -- Add XP
  UPDATE profiles 
  SET total_xp = total_xp + xp_amount,
      updated_at = NOW()
  WHERE id = user_id;
  
  -- Check for level up
  SELECT required_xp INTO next_level_xp
  FROM levels 
  WHERE id = current_level + 1;
  
  IF next_level_xp IS NOT NULL AND (current_xp + xp_amount) >= next_level_xp THEN
    UPDATE profiles 
    SET level_id = current_level + 1
    WHERE id = user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
