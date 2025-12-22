from locust import HttpUser, task, between

class DashboardPaginationUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def fetch_with_pagination(self):
        # Simulate paginated requests
        for page in [1,2,3]:
            self.client.get(f"/dashboard?page={page}&per_page=10&sort_by=id&sort_order=desc")

class DashboardNoPaginationUser(HttpUser):
    wait_time = between(1, 3)

    @task
    def fetch_no_pagination(self):
        # Simulate non-paginated requests
        self.client.get("/dashboard")

# Run instructions:
# pip install locust
# locust -f tools/locust/locustfile.py --host=http://localhost:8000/api
# Then open http://localhost:8089 and start tests (set users: 10/100/1000 and spawn rate and run duration 5m)
