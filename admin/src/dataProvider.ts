// src/dataProvider.ts
import type { DataProvider, RaRecord, Identifier } from 'react-admin';
import { PATHS, apiClient } from './api/endpoints';

const normalizeId = (item: Record<string, unknown>): RaRecord => ({
  ...item,
  id: (item.id ?? item._id) as Identifier,
});

const FORM_DATA_RESOURCES = new Set(['portfolio']);

function toFormData(data: Record<string, unknown>): FormData {
  const form = new FormData();
  for (const [key, value] of Object.entries(data)) {
    if (key === 'id') continue;
    if (key === 'file') {
      const f = value as { rawFile?: File } | null;
      if (f?.rawFile) form.append('file', f.rawFile);
    } else if (value !== null && value !== undefined) {
      form.append(key, String(value));
    }
  }
  return form;
}

const dataProvider: DataProvider = {
  getList: async (resource) => {
    const json = await apiClient<Record<string, unknown>[]>(PATHS[resource as keyof typeof PATHS]);
    const data = json.map(normalizeId);
    return { data: data as any, total: data.length };
  },

  getOne: async (resource, { id }) => {
    const json = await apiClient<Record<string, unknown>>(`${PATHS[resource as keyof typeof PATHS]}/${id}`);
    return { data: normalizeId(json) as any };
  },

  create: async (resource, { data }) => {
    const isForm = FORM_DATA_RESOURCES.has(resource);
    const body = isForm ? toFormData(data) : data;
    const json = await apiClient<Record<string, unknown>>(PATHS[resource as keyof typeof PATHS], { method: 'POST', body, isFormData: isForm });
    return { data: normalizeId(json) as any };
  },

  update: async (resource, { id, data }) => {
    const isForm = FORM_DATA_RESOURCES.has(resource);
    const body = isForm ? toFormData(data) : data;
    const json = await apiClient<Record<string, unknown>>(`${PATHS[resource as keyof typeof PATHS]}/${id}`, { method: 'PUT', body, isFormData: isForm });
    return { data: normalizeId(json) as any };
  },

  delete: async (resource, { id }) => {
    await apiClient<void>(`${PATHS[resource as keyof typeof PATHS]}/${id}`, { method: 'DELETE' });
    return { data: { id } as any };
  },

  deleteMany: async (resource, { ids }) => {
    await Promise.all(ids.map((id) => apiClient<void>(`${PATHS[resource as keyof typeof PATHS]}/${id}`, { method: 'DELETE' })));
    return { data: ids };
  },

  getMany: async (resource, { ids }) => {
    const json = await apiClient<Record<string, unknown>[]>(PATHS[resource as keyof typeof PATHS]);
    const idSet = new Set(ids.map(String));
    const data = json.map(normalizeId).filter((item) => idSet.has(String(item.id)));
    return { data: data as any };
  },

  getManyReference: async (resource) => {
    const json = await apiClient<Record<string, unknown>[]>(PATHS[resource as keyof typeof PATHS]);
    const data = json.map(normalizeId);
    return { data: data as any, total: data.length };
  },

  updateMany: async (resource, { ids, data }) => {
    await Promise.all(ids.map((id) => apiClient<void>(`${PATHS[resource as keyof typeof PATHS]}/${id}`, { method: 'PUT', body: data })));
    return { data: ids };
  },
};

export default dataProvider;