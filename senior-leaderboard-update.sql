-- SQL function to safely increment total_tokens for a given user ID
-- Run this in your Supabase SQL Editor
CREATE OR REPLACE FUNCTION increment_tokens(user_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE profiles
  SET total_tokens = total_tokens + 1
  WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
