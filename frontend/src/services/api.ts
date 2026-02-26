const API_URL = 'http://localhost:3001/api/v1'; // Substitui pelo URL real do teu servidor (ex: http://localhost:5000)

export const api = {
  getProjects: () => fetch(`${API_URL}/projects`).then(res => res.json()),
  getEvents: () => fetch(`${API_URL}/events`).then(res => res.json()),
  getNews: () => fetch(`${API_URL}/news`).then(res => res.json()),
};