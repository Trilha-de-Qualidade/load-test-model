import http from "k6/http";
import { check } from "k6";
const axios = require('axios');

export const options = {
  vus: 5,
  stages: [
    {target: 70, duration: '20s'},
    {target: 30, duration: '10s'},
    {target: 30, duration: '7s'},
    {target: 0, duration: '10s'}
  ]
};

export default function () {
  check(http.get("https://test-api.k6.io/"), {
    "status is 200": (r) => r.status == 200,
    "protocol is HTTP/2": (r) => r.proto == "HTTP/2.0",
  });
}

