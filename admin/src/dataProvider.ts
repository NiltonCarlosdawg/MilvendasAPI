import { fetchUtils } from 'react-admin';

const baseUrl = 'https://milvendasapi.onrender.com/api/v1';

/**
 * Helper para injetar o Token em requisições JSON ou FormData
 */
const httpClient = async (url: string, options: any = {}) => {
  const token = localStorage.getItem('token');
  const headers = new Headers(options.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  // Se o corpo não for FormData, definimos como JSON
  if (options.body && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(url, { ...options, headers });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || `Erro HTTP ${response.status}`);
  }

  // Se o método for DELETE e não houver corpo, retornamos vazio
  if (response.status === 204) return { json: {} };
  
  return { json: await response.json() };
};

const dataProvider = {
  // GET LIST: Resolve o erro de Content-Range ignorando-o e usando o tamanho do array
  getList: async (resource: string, params: any) => {
    const { json } = await httpClient(`${baseUrl}/${resource}`);
    
    // Garantimos que cada item tem um 'id' (essencial para React Admin)
    const data = json.map((item: any) => ({
      ...item,
      id: item.id || item._id,
    }));

    return {
      data,
      total: data.length, // O React Admin usa isto para paginação interna
    };
  },

  getOne: async (resource: string, params: any) => {
    const { json } = await httpClient(`${baseUrl}/${resource}/${params.id}`);
    return { data: { ...json, id: json.id || json._id } };
  },

  create: async (resource: string, params: any) => {
    let body: any;
    let url = `${baseUrl}/${resource}`;

    if (resource === 'portfolio') {
      body = new FormData();
      Object.keys(params.data).forEach(key => {
        if (key === 'file') {
          if (params.data.file?.rawFile) body.append('file', params.data.file.rawFile);
        } else {
          body.append(key, params.data[key]);
        }
      });
    } else if (resource === 'events') {
      url = `${baseUrl}/events/admin/create`;
      body = JSON.stringify(params.data);
    } else {
      body = JSON.stringify(params.data);
    }

    const { json } = await httpClient(url, { method: 'POST', body });
    return { data: { ...json, id: json.id || json._id } };
  },

  update: async (resource: string, params: any) => {
    let body: any;
    let url = `${baseUrl}/${resource}/${params.id}`;

    if (resource === 'portfolio') {
      body = new FormData();
      Object.keys(params.data).forEach(key => {
        if (key === 'file') {
          if (params.data.file?.rawFile) body.append('file', params.data.file.rawFile);
        } else if (key !== 'id') {
          body.append(key, params.data[key]);
        }
      });
    } else if (resource === 'events') {
      url = `${baseUrl}/events/admin/${params.id}`;
      body = JSON.stringify(params.data);
    } else {
      body = JSON.stringify(params.data);
    }

    const { json } = await httpClient(url, { method: 'PUT', body });
    return { data: { ...json, id: json.id || json._id } };
  },

  delete: async (resource: string, params: any) => {
    const url = resource === 'events' 
      ? `${baseUrl}/events/admin/${params.id}` 
      : `${baseUrl}/${resource}/${params.id}`;

    await httpClient(url, { method: 'DELETE' });
    return { data: { id: params.id } };
  },

  // Métodos adicionais necessários para evitar erros de undefined
  getMany: async (resource: string, params: any) => {
    const { json } = await httpClient(`${baseUrl}/${resource}`);
    return { data: json.filter((item: any) => params.ids.includes(item.id || item._id)) };
  },

  getManyReference: async (resource: string, params: any) => {
    const { json } = await httpClient(`${baseUrl}/${resource}`);
    return { data: json, total: json.length };
  },
};

export default dataProvider;