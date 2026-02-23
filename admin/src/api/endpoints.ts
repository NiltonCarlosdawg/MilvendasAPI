//export const BASE_URL = 'http://localhost:3001/api/v1';
export const BASE_URL = 'https://api.milvendas.ao/api/v1';

// Paths relativos — usados pelo dataProvider e apiClient (que já prefixa BASE_URL)
export const PATHS = {
  events:     '/events',
  portfolio:  '/portfolio',
  newsletter: '/newsletter',
  auth:       '/auth',
} as const;

// URLs absolutas — usadas nos componentes para construir links de imagens/média
export const ENDPOINTS = {
  events:     `${BASE_URL}${PATHS.events}`,
  portfolio:  `${BASE_URL}${PATHS.portfolio}`,
  newsletter: `${BASE_URL}${PATHS.newsletter}`,
  auth:       `${BASE_URL}${PATHS.auth}`,
} as const;

export { apiClient } from './apiClient';