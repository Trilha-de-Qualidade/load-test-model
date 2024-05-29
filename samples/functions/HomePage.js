import http from "k6/http";
import { check, sleep } from "k6";

export default function HomePage () {
    const response = http.get(http.get("https://test-api.k6.io/"), {
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