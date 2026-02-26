// src/resources/events/index.tsx
import {
  List, Datagrid, TextField, DateField,
  EditButton, DeleteButton, useRecordContext,
} from 'react-admin';

export { EventEdit } from './EventEdit';
export { default as EventCreate } from './EventCreate';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://api.milvendas.ao';

const CoverImageField = (_props: { label?: string }) => {
  const record = useRecordContext();

  // Procura a imagem marcada como capa, ou a primeira disponível
  const cover = record?.media?.find((m: any) => m.isCover) || record?.media?.[0];

  // URL correto: API_BASE_URL + /uploads/events/ + filename
  const imageUrl = cover
    ? `${API_BASE_URL}/uploads/events/${cover.url}`
    : null;

  return imageUrl ? (
    <img
      src={imageUrl}
      alt="Capa"
      style={{ maxWidth: 72, height: 48, objectFit: 'cover', borderRadius: 4 }}
      onError={(e) => {
        // Se a imagem falhar, mostra placeholder
        const target = e.target as HTMLImageElement;
        target.style.display = 'none';
        target.insertAdjacentHTML('afterend', '<span style="color:#999;font-size:12px">Sem capa</span>');
      }}
    />
  ) : (
    <span style={{ color: '#999', fontSize: 12 }}>Sem capa</span>
  );
};

export const EventList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Título" />
      <TextField source="eventType" label="Tipo" />
      <DateField source="eventDate" label="Data" locales="pt-PT" />
      <CoverImageField label="Capa" />
      <TextField source="status" label="Status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);