import http from "k6/http";
import { check, sleep, group } from "k6";

export const options = {
  vus: 5,
  stages: [
    {target: 10, duration: '2s'},
    {target: 5, duration: '3s'},
    {target: 2, duration: '2s'},
    {target: 0, duration: '1s'}
  ],
  thresholds: { // configure thresholds
    http_req_failed: ['rate<=0.05'],
    http_req_duration: ['p(95)<=5000'],
  },
};

export default function () {
  group('01_VisitHomepage', function () {
    HomePage();
    // Add more functions here
  });

  // Add more groups here
  group('02_Checkout', function () {
    // Add more functions here
  });


}

function HomePage() {
  const response = http.get("https://test-api.k6.io/", {
          tags: { // use tags to help filtering and analysis
              page: 'Homepage',
              type: 'HTML',
          }
      });

  check(response, {
      "status is 200": (r) => r.status == 200,
      "protocol is HTTP/2": (r) => r.proto == "HTTP/2.0",
  });
  sleep(1);
}
