-- Example optimizations for `users` table
-- Original (non-optimized) example:
-- SELECT * FROM users WHERE department LIKE '%IT%' ORDER BY created_at DESC LIMIT 10;

-- Add indexes to improve filter/sort performance
CREATE INDEX IF NOT EXISTS idx_users_department ON users(department);
CREATE INDEX IF NOT EXISTS idx_users_status ON users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_name ON users(name);

-- Optimized query (avoid SELECT *):
-- SELECT id, name, email, department, status, created_at
-- FROM users
-- WHERE department = 'IT'
-- ORDER BY created_at DESC
-- LIMIT 10;

-- For PostgreSQL measure with EXPLAIN ANALYZE
-- EXPLAIN ANALYZE SELECT id, name, email, department, status, created_at FROM users WHERE department = 'IT' ORDER BY created_at DESC LIMIT 10;

-- For MySQL use EXPLAIN FORMAT=JSON
-- EXPLAIN FORMAT=JSON SELECT id, name, email, department, status, created_at FROM users WHERE department = 'IT' ORDER BY created_at DESC LIMIT 10;
