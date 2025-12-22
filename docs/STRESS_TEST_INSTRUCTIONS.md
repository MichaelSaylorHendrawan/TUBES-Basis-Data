# Stress Test Instructions (Locust)

Tools: Locust (Python) — chosen because it's lightweight, easy to script, and works well for HTTP API stress testing.

Setup:
- Install Python 3.8+ and pip
- pip install locust

Run scenarios:
- Open terminal and run:
  locust -f tools/locust/locustfile.py --host=http://localhost:8000/api
- Open browser at http://localhost:8089
- Configure test runs for each scenario:
  - Scenario 1 (With Pagination): use users of class DashboardPaginationUser
  - Scenario 2 (Without Pagination): use users of class DashboardNoPaginationUser
- Test parameters per assignment:
  - Users: 10, 100, 1000
  - Duration: 5 minutes each

Metrics to capture:
- Response time (median, 95th)
- Error rate
- Throughput (req/s)

Documentation deliverables:
- Screenshot of Locust web UI configuration (users, spawn rate, duration)
- Graphs comparing response time vs number of users for both scenarios
- Short analysis describing bottlenecks (DB, CPU, memory)
