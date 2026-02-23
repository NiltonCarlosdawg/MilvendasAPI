// src/api/resources.ts
import { PATHS,  apiClient } from './endpoints';

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface EventRecord {
  id: string;
  title: string;
  eventType: 'OWN' | 'EXTERNAL' | 'THIRD_PARTY';
  descriptionShort?: string;
  descriptionLong?: string;
  eventDate: string;
  eventEndDate?: string;
  location?: string;
  address?: string;
  organizerName?: string;
  organizerContact?: string;
  capacity?: number;
  allowTicketRequest: boolean;
  externalLink?: string;
  status: 'DRAFT' | 'PUBLISHED';
  media?: Array<{ url: string }>;
  createdAt: string;
}

export interface PortfolioRecord {
  id: string;
  title: string;
  description: string;
  mediaType: 'IMAGE' | 'VIDEO';
  mediaUrl?: string;
  order?: number;
  createdAt: string;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  active: boolean;
  createdAt: string;
}

export interface NewsletterBroadcastPayload {
  subject: string;
  message: string;
}

// ─── Events API ───────────────────────────────────────────────────────────────

export const eventsApi = {
  list:    ()                              => apiClient<EventRecord[]>(PATHS.events),
  getOne:  (id: string)                   => apiClient<EventRecord>(`${PATHS.events}/${id}`),
  create:  (data: FormData | object)      => apiClient<EventRecord>(PATHS.events, { method: 'POST', body: data, isFormData: data instanceof FormData }),
  update:  (id: string, data: FormData | object) => apiClient<EventRecord>(`${PATHS.events}/${id}`, { method: 'PUT', body: data, isFormData: data instanceof FormData }),
  remove:  (id: string)                   => apiClient<void>(`${PATHS.events}/${id}`, { method: 'DELETE' }),
};

// ─── Portfolio API ────────────────────────────────────────────────────────────

export const portfolioApi = {
  list:    ()                             => apiClient<PortfolioRecord[]>(PATHS.portfolio),
  getOne:  (id: string)                  => apiClient<PortfolioRecord>(`${PATHS.portfolio}/${id}`),
  create:  (data: FormData)              => apiClient<PortfolioRecord>(PATHS.portfolio, { method: 'POST', body: data, isFormData: true }),
  update:  (id: string, data: FormData)  => apiClient<PortfolioRecord>(`${PATHS.portfolio}/${id}`, { method: 'PUT', body: data, isFormData: true }),
  remove:  (id: string)                  => apiClient<void>(`${PATHS.portfolio}/${id}`, { method: 'DELETE' }),
};

// ─── Newsletter API ───────────────────────────────────────────────────────────

export const newsletterApi = {
  list:    ()                                      => apiClient<NewsletterSubscriber[]>(PATHS.newsletter),
  remove:  (id: string)                            => apiClient<void>(`${PATHS.newsletter}/${id}`, { method: 'DELETE' }),
  broadcast: (payload: NewsletterBroadcastPayload) => apiClient<{ sent: number }>(`${PATHS.newsletter}/broadcast`, { method: 'POST', body: payload }),
  uploadImage: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return apiClient<{ url: string }>(`${PATHS.newsletter}/upload-image`, { method: 'POST', body: form, isFormData: true });
  },
};