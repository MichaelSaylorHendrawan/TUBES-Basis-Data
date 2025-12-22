# Setup & Run (Windows)

1. Backend
- composer install
- php artisan migrate
- php artisan db:seed --class=DatabaseSeeder
  - Note: seeding 500k users may take long time and consume resources. Consider reducing the total by editing `DatabaseSeeder` for testing.
- php artisan route:clear && php artisan config:clear && php artisan optimize:clear
- Start backend (e.g., php artisan serve --port=8000)

2. Frontend
- cd frontend
- npm install
- npm run dev (Vite default at http://localhost:5173)

3. Stress Test (Locust)
- pip install locust
- locust -f tools/locust/locustfile.py --host=http://localhost:8000/api
- Open http://localhost:8089 and run scenarios (users: 10, 100, 1000; duration: 5m)

4. Query Performance
- Use MySQL or PostgreSQL's EXPLAIN/EXPLAIN ANALYZE to compare before/after
- See `tools/sql/optimize_queries.sql` for suggested indexes and example queries

5. Notes
- If you use another DB host/credentials, update `.env` accordingly
- For large-scale seeding, consider running seeder in background or on a more powerful machine
