import { check, sleep } from 'k6';
import http from 'k6/http';

export const options = {
  stages: [
    { duration: '10s', target: 20 },  // Sube rápido a 20 usuarios en 10 segundos
    { duration: '20s', target: 50 },  // Estresa el sistema con 50 usuarios por 20 segundos
    { duration: '10s', target: 0 },   // Baja a 0 usuarios
  ],
  thresholds: {
    http_req_failed: ['rate<0.02'],    // Tolerancia menor al 2% de errores
    http_req_duration: ['p(95)<1000'], // El 95% de las peticiones deben tardar menos de 1 segundo
  },
};

export default function () {
  const BASE_URL = 'http://localhost:5000';
  const params = { headers: { 'Content-Type': 'application/json' } };

  // 1. Simular Petición de Login
  let loginRes = http.post(`${BASE_URL}/login`, JSON.stringify({ email: 'test@chambapp.com' }), params);
  check(loginRes, { 'Login responde 201/200': (r) => r.status === 200 || r.status === 201 });
  sleep(1);

  // 2. Simular Búsqueda de Técnicos
  let searchRes = http.get(`${BASE_URL}/search?categoria=electricista`);
  check(searchRes, { 'Búsqueda responde 200': (r) => r.status === 200 });
  sleep(1);
}