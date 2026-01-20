// src/resources/events/index.tsx
import { List, Datagrid, TextField, DateField } from 'react-admin';

export const EventList = () => (
  <List>
    <Datagrid rowClick="edit">
      <TextField source="title" label="Título" />
      <DateField source="eventDate" label="Data do Evento" />
      <TextField source="location" label="Local" />
      <TextField source="status" label="Status" />
    </Datagrid>
  </List>
);

export const EventEdit = () => <div>Edição de Evento (em construção)</div>;
export const EventCreate = () => <div>Criação de Evento (em construção)</div>;