-- 1. Optimize Leaderboard Queries
-- Speeds up: SELECT * FROM profiles WHERE role = 'FRESHMAN' ORDER BY total_tokens DESC
CREATE INDEX IF NOT EXISTS idx_profiles_role_tokens ON profiles (role, total_tokens DESC);

-- 2. Optimize Dashboard & History Queries
-- Speeds up: SELECT * FROM scans WHERE freshman_id = ?
CREATE INDEX IF NOT EXISTS idx_scans_freshman_id ON scans (freshman_id);

-- 3. Optimize Senior Verification Queries
-- Speeds up: SELECT * FROM scans WHERE senior_id = ?
CREATE INDEX IF NOT EXISTS idx_scans_senior_id ON scans (senior_id);
