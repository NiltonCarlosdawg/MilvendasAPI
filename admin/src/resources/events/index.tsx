import {
  List, Datagrid, TextField, DateField,
  EditButton, DeleteButton, useRecordContext,
} from 'react-admin';
import { ENDPOINTS } from '../../api/endpoints';

export { EventEdit } from './EventEdit';
export { default as EventCreate } from './EventCreate';

const CoverImageField = (_props: { label?: string }) => {
  const record = useRecordContext();
  const cover = record?.media?.[0]?.url as string | undefined;
  return cover ? (
    <img
      src={`${ENDPOINTS.events}/uploads/${cover}`}
      alt="Capa"
      style={{ maxWidth: '80px', borderRadius: '4px' }}
    />
  ) : (
    <span style={{ color: '#999' }}>Sem capa</span>
  );
};

export const EventList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }}>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Título" />
      <TextField source="eventType" label="Tipo" />
      <DateField source="eventDate" label="Data" locales="pt-BR" />
      <CoverImageField label="Capa" />
      <TextField source="status" label="Status" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);