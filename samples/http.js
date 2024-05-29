import { HomePage } from './functions/HomePage.js';

export const options = {
  vus: 5,
  stages: [
    {target: 70, duration: '20s'},
    {target: 30, duration: '10s'},
    {target: 30, duration: '7s'},
    {target: 0, duration: '10s'}
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

