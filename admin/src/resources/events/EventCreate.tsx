import { Create, SimpleForm, TextInput, DateInput, SelectInput, NumberInput, BooleanInput, ImageInput, ImageField } from 'react-admin';
import { RichTextInput } from 'ra-input-rich-text';
const EventCreate = () => (
  <Create>
    <SimpleForm>
      <TextInput source="title" label="Título" fullWidth required />
      <SelectInput
        source="eventType"
        label="Tipo de Evento"
        choices={[
          { id: 'OWN', name: 'Próprio (Mil Vendas)' },
          { id: 'EXTERNAL', name: 'Externo' },
        ]}
        required
      />
      <TextInput source="descriptionShort" label="Descrição Curta" multiline fullWidth />
      <RichTextInput source="descriptionLong" label="Descrição Completa" />
      <DateInput source="eventDate" label="Data de Início" required />
      <DateInput source="eventEndDate" label="Data de Término" />
      <TextInput source="location" label="Local" fullWidth />
      <TextInput source="address" label="Endereço Completo" fullWidth />
      <TextInput source="organizerName" label="Nome do Organizador" />
      <TextInput source="organizerContact" label="Contato do Organizador" />
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

      {/* Upload de capa */}
      <ImageInput
        source="coverImage"
        label="Imagem de Capa"
        accept="image/*"
        multiple={false}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);

export default EventCreate;