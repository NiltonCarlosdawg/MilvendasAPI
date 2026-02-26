// src/resources/events/EventCreate.tsx
import { useState } from 'react';
import {
  Create, SimpleForm, TextInput, DateInput, SelectInput,
  NumberInput, BooleanInput, required, useNotify, useRedirect,
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://localhost:3001';

// ─── Componente de upload separado (fora do SimpleForm) ───────────────────────
const CoverImageUploader = ({ eventId }: { eventId: string }) => {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const notify = useNotify();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview local imediato
    setPreview(URL.createObjectURL(file));
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('files', file);       // ← nome do campo que o multer espera
      formData.append('mediaType', 'image');
      formData.append('isCover', 'true');

      const token = localStorage.getItem('token') || sessionStorage.getItem('token');

      const res = await fetch(`${API_BASE_URL}/api/v1/events/${eventId}/media`, {
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

      notify('Imagem enviada com sucesso!', { type: 'success' });
    } catch (error: any) {
      notify(`Erro ao enviar imagem: ${error.message}`, { type: 'error' });
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ marginTop: 16 }}>
      <p style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
        Imagem de Capa {eventId ? '' : '(salve o evento primeiro para adicionar imagem)'}
      </p>
      {preview && (
        <img
          src={preview}
          alt="Preview"
          style={{ maxWidth: 200, borderRadius: 8, marginBottom: 8, display: 'block' }}
        />
      )}
      <input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        onChange={handleFileChange}
        disabled={!eventId || uploading}
        style={{ display: 'block' }}
      />
      {uploading && <p style={{ fontSize: 12, color: '#1976d2' }}>A enviar imagem...</p>}
    </div>
  );
};

// ─── Transform: garante que o ImageInput do RA não interfere ──────────────────
const transformEvent = (data: any) => {
  // Remove coverImage do payload — o upload é feito separadamente via multipart
  const { coverImage, ...rest } = data;
  return rest;
};

// ─── Wrapper para aceder ao ID criado e fazer o upload pós-criação ────────────
const EventCreateForm = () => {
  const [createdEventId, setCreatedEventId] = useState<string | null>(null);
  const notify = useNotify();
  const redirect = useRedirect();

  const onSuccess = (data: any) => {
    setCreatedEventId(data.id);
    notify('Evento criado! Pode agora adicionar a imagem de capa abaixo.', { type: 'success' });
    // Não redireciona automaticamente — fica na página para o upload
  };

  return (
    <Create transform={transformEvent} mutationOptions={{ onSuccess }}>
      <SimpleForm>
        <TextInput source="title" label="Título" fullWidth validate={required()} />
        <SelectInput
          source="eventType"
          label="Tipo de Evento"
          choices={[
            { id: 'OWN', name: 'Próprio (Mil Vendas)' },
            { id: 'THIRD_PARTY', name: 'Externo' },
          ]}
          validate={required()}
        />
        <TextInput source="descriptionShort" label="Descrição Curta" multiline fullWidth />
        <RichTextInput source="descriptionLong" label="Descrição Completa" />
        <DateInput source="eventDate" label="Data de Início" validate={required()} />
        <DateInput source="eventEndDate" label="Data de Término" />
        <TextInput source="location" label="Local" fullWidth validate={required()} />
        <TextInput source="address" label="Endereço Completo" fullWidth />
        <TextInput source="organizerName" label="Nome do Organizador" />
        <TextInput source="organizerContact" label="Contacto do Organizador" />
        <NumberInput source="capacity" label="Capacidade Máxima" min={0} />
        <BooleanInput source="allowTicketRequest" label="Permitir Solicitação de Ingresso" />
        <TextInput source="externalLink" label="Link Externo (opcional)" />
        <SelectInput
          source="status"
          label="Status"
          choices={[
            { id: 'DRAFT', name: 'Rascunho' },
            { id: 'PUBLISHED', name: 'Publicado' },
          ]}
          defaultValue="DRAFT"
        />

        {/* Upload só aparece após a criação do evento */}
        {createdEventId && (
          <CoverImageUploader eventId={createdEventId} />
        )}

        {createdEventId && (
          <div style={{ marginTop: 16 }}>
            <button
              type="button"
              onClick={() => redirect('edit', 'events', createdEventId)}
              style={{
                padding: '8px 16px',
                background: '#1976d2',
                color: '#fff',
                border: 'none',
                borderRadius: 4,
                cursor: 'pointer',
                fontSize: 14
              }}
            >
              Ir para edição do evento →
            </button>
          </div>
        )}
      </SimpleForm>
    </Create>
  );
};

export default EventCreateForm;