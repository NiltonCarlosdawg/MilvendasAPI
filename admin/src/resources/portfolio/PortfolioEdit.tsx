// src/resources/portfolio/PortfolioEdit.tsx
import { 
  Edit, 
  SimpleForm, 
  TextInput, 
  SelectInput, 
  NumberInput, 
  ImageInput, 
  ImageField, 
  required, 
  useRecordContext 
} from 'react-admin';

const CurrentMediaPreview = () => {
  const record = useRecordContext();
  if (!record?.mediaUrl) return null;
  return (
    <div style={{ margin: '1rem 0' }}>
      <p style={{ fontSize: '0.8rem', color: '#666' }}>Mídia atual:</p>
      <img
        src={`http://localhost:3001/uploads/${record.mediaUrl}`}
        alt="Preview"
        style={{ maxWidth: '200px', borderRadius: '8px', border: '1px solid #ddd' }}
      />
    </div>
  );
};

export const PortfolioEdit = () => (
  <Edit mutationMode="pessimistic">
    <SimpleForm>
      <TextInput source="id" disabled label="ID" />
      <TextInput source="title" label="Título" fullWidth validate={[required()]} />
      
      <SelectInput 
        source="mediaType" 
        label="Tipo" 
        choices={[
          { id: 'IMAGE', name: 'Imagem' },
          { id: 'VIDEO', name: 'Vídeo' },
        ]} 
        validate={[required()]} 
      />

      <TextInput source="description" label="Descrição" multiline fullWidth validate={[required()]} />
      <NumberInput source="order" label="Ordem" defaultValue={0} />

      <CurrentMediaPreview />

      {/* Ajustado para evitar o erro de MIME type no console */}
   <ImageInput
  source="file"
  label="Mídia (Imagem ou Vídeo)"
  accept={{
    'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
    'video/*': ['.mp4', '.webm']
  }}
  multiple={false}
>
  <ImageField source="src" title="title" />
</ImageInput>
    </SimpleForm>
  </Edit>
);