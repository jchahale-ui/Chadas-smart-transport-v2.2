// gps-simulator/simulate.js
// Simulates 3 buses moving along GreenHill routes
const axios = require('axios');

const BACKEND_URL = 'http://localhost:3000/api/buses/update'; // change to your deployed URL

const routes = {
  1: { // Bus A - Route: Westlands
    points: [
      {lat: -1.2650, lng: 36.8000}, // Start: School
      {lat: -1.2700, lng: 36.8100},
      {lat: -1.2800, lng: 36.8200}, // Westlands
      {lat: -1.2900, lng: 36.8300}
    ]
  },
 2: { // Bus B - Route: Karen
    points: [
      {lat: -1.2650, lng: 36.8000}, // Start: School
      {lat: -1.3100, lng: 36.6900},
      {lat: -1.3200, lng: 36.7000} // Karen
    ]
  },
  3: { // Bus C - Route: Eastleigh
    points: [
      {lat: -1.2650, lng: 36.8000}, // Start: School
      {lat: -1.2700, lng: 36.8500},
      {lat: -1.2600, lng: 36.8600} // Eastleigh
    ]
  }
};

let currentPoint = {1: 0, 2: 0, 3: 0};

function moveBus(busId) {
  const route = routes[busId];
  currentPoint[busId] = (currentPoint[busId] + 1) % route.points.length;
  return route.points[currentPoint[busId]];
}

async function sendGPS() {
  for (let busId in routes) {
    const location = moveBus(busId);
    const payload = {
      busId: parseInt(busId),
      lat: location.lat,
      lng: location.lng,
      speed: 30 + Math.floor(Math.random() * 20),
      timestamp: new Date().toISOString()
    };

    console.log(`Sending GPS for Bus ${busId}:`, payload);

    // Send to backend
    try {
      await axios.post(BACKEND_URL, payload);
    } catch (err) {
      console.log("Backend not running. Save offline:", payload);
    }
  }
}

// Send GPS every 5 seconds
console.log("CHADAS GPS Simulator Started. Press Ctrl+C to stop");
setInterval(sendGPS, 5000);
