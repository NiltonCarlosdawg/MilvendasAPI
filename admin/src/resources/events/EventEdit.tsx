// src/resources/events/EventEdit.tsx
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  DateInput, 
  SelectInput, 
  NumberInput, 
  BooleanInput, 
  ImageInput, 
  ImageField,
  required
} from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';

export const EventEdit = () => (
  // mutationMode="pessimistic" garante que a requisição PUT seja disparada imediatamente
  <Edit mutationMode="pessimistic" redirect="list">
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
      
      <NumberInput source="capacity" label="Capacidade" />
      <BooleanInput source="allowTicketRequest" label="Aceitar Pedidos de Ingresso" />
      
      <SelectInput
        source="status"
        choices={[
          { id: 'DRAFT', name: 'Rascunho' },
          { id: 'PUBLISHED', name: 'Publicado' },
        ]}
      />

      <ImageInput source="coverImage" label="Nova Capa" accept="image/*">
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Edit>
);