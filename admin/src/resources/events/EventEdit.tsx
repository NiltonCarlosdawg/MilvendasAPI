// src/resources/events/EventEdit.tsx
import { useState } from 'react';
import {
  Edit, SimpleForm, TextInput, DateInput, SelectInput,
  NumberInput, BooleanInput, required, useNotify, useRecordContext,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// ─── Exibe a capa atual + permite substituir ──────────────────────────────────
const CoverImageManager = () => {
  const record = useRecordContext();
  const notify = useNotify();
  const [uploading, setUploading] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  if (!record) return null;

  // Capa actual vinda da BD
  const currentCover = record.media?.find((m: any) => m.isCover) || record.media?.[0];
  // URL correto: API_BASE_URL + /uploads/events/ + filename
  const currentCoverUrl = currentCover
    ? `${API_BASE_URL}/uploads/events/${currentCover.url}`
    : null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLocalPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('files', file);        // ← campo que o multer espera
      formData.append('mediaType', 'image');
      formData.append('isCover', 'true');

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const res = await fetch(`${API_BASE_URL}/api/v1/events/${record.id}/media`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // NÃO definir Content-Type — o browser define automaticamente com boundary
        },
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Erro no upload');
      }

      notify('Imagem de capa atualizada!', { type: 'success' });
    } catch (error: any) {
      notify(`Erro: ${error.message}`, { type: 'error' });
      setLocalPreview(null);
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteMedia = async (mediaId: string) => {
    if (!confirm('Tem a certeza que quer remover esta imagem?')) return;

    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/api/v1/events/admin/media/${mediaId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (!res.ok) throw new Error('Erro ao eliminar imagem');
      notify('Imagem removida. Recarregue a página para ver as alterações.', { type: 'success' });
    } catch (error: any) {
      notify(`Erro: ${error.message}`, { type: 'error' });
    }
  };

  return (
    <div style={{ marginTop: 16, padding: 16, border: '1px solid #e0e0e0', borderRadius: 8 }}>
      <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#333' }}>
        Imagem de Capa
      </p>

      {/* Preview: mostra local se acabou de fazer upload, senão mostra a da BD */}
      {(localPreview || currentCoverUrl) && (
        <div style={{ marginBottom: 12, position: 'relative', display: 'inline-block' }}>
          <img
            src={localPreview || currentCoverUrl!}
            alt="Capa atual"
            style={{ maxWidth: 240, borderRadius: 8, display: 'block' }}
            onError={(e) => {
              // Se a imagem não carregar, esconde
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
          {currentCover && !localPreview && (
            <button
              type="button"
              onClick={() => handleDeleteMedia(currentCover.id)}
              style={{
                position: 'absolute', top: 4, right: 4,
                background: 'rgba(211,47,47,0.85)', color: '#fff',
                border: 'none', borderRadius: 4, padding: '2px 8px',
                cursor: 'pointer', fontSize: 12
              }}
            >
              ✕ Remover
            </button>
          )}
        </div>
      )}

      {!currentCoverUrl && !localPreview && (
        <p style={{ fontSize: 12, color: '#999', marginBottom: 12 }}>Sem imagem de capa</p>
      )}

      {/* Input de novo ficheiro */}
      <div>
        <label style={{ fontSize: 12, color: '#555', display: 'block', marginBottom: 4 }}>
          {currentCoverUrl ? 'Substituir imagem:' : 'Adicionar imagem:'}
        </label>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={handleFileChange}
          disabled={uploading}
        />
        {uploading && (
          <p style={{ fontSize: 12, color: '#1976d2', marginTop: 4 }}>A enviar...</p>
        )}
      </div>
    </div>
  );
};

// ─── Transform: remove campos que não devem ir no PUT ────────────────────────
const transformEvent = (data: any) => {
  const { media, createdAt, updatedAt, viewCount, ...rest } = data;
  return rest;
};

// ─── Componente principal ─────────────────────────────────────────────────────
export const EventEdit = () => (
  <Edit mutationMode="pessimistic" redirect="list" transform={transformEvent}>
    <SimpleForm>
      <TextInput source="id" label="ID" disabled fullWidth />
      <TextInput source="title" label="Título" validate={required()} fullWidth />
      <SelectInput
        source="eventType"
        label="Tipo"
        choices={[
          { id: 'OWN', name: 'Próprio' },
          { id: 'THIRD_PARTY', name: 'Externo' },
        ]}
        validate={required()}
      />
      <TextInput source="descriptionShort" label="Resumo" multiline fullWidth validate={required()} />
      <RichTextInput source="descriptionLong" label="Descrição Completa" />
      <DateInput source="eventDate" label="Início" validate={required()} />
      <DateInput source="eventEndDate" label="Término" />
      <TextInput source="location" label="Local" validate={required()} fullWidth />
      <TextInput source="address" label="Endereço" fullWidth />
      <TextInput source="organizerName" label="Organizador" />
      <TextInput source="organizerContact" label="Contacto do Organizador" />
      <NumberInput source="capacity" label="Capacidade" />
      <BooleanInput source="allowTicketRequest" label="Aceitar Pedidos de Ingresso" />
      <TextInput source="externalLink" label="Link Externo" />
      <SelectInput
        source="status"
        choices={[
          { id: 'DRAFT', name: 'Rascunho' },
          { id: 'PUBLISHED', name: 'Publicado' },
        ]}
      />

      {/* Gestor de imagem — faz upload direto via multipart/form-data */}
      <CoverImageManager />
    </SimpleForm>
  </Edit>
);