// src/dataProvider.ts
import simpleRestProvider from 'ra-data-simple-rest';

const baseDataProvider = simpleRestProvider('http://localhost:3001/api/v1', {
  httpClient: (url, options = {}) => {
    const token = localStorage.getItem('token');
    if (token) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      };
    }
    return fetch(url, options).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json().then(json => ({ status: response.status, body: json }));
      }
      throw new Error(response.statusText);
    });
  },
});

// Wrapper que ignora a exigência de Content-Range
const customDataProvider = {
  ...baseDataProvider,
  getList: (resource, params) => {
    return baseDataProvider.getList(resource, params).catch(error => {
      if (error.message.includes('Content-Range')) {
        // Ignora o erro específico e retorna dados sem paginação completa
        return baseDataProvider.getList(resource, { ...params, pagination: { page: 1, perPage: 100 } });
      }
      throw error;
    });
  },
};

export { customDataProvider as dataProvider };