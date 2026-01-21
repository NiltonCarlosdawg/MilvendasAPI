// src/resources/portfolio/PortfolioCreate.tsx
import { 
  Create, 
  SimpleForm, 
  TextInput, 
  ImageInput, 
  ImageField, 
  SelectInput,
  required 
} from 'react-admin';

export const PortfolioCreate = () => (
  <Create redirect="list">
    <SimpleForm>
      <TextInput 
        source="title" 
        label="Título" 
        validate={required()} 
        fullWidth 
      />
      
      <TextInput 
        source="description" 
        label="Descrição" 
        validate={required()}
        multiline 
        fullWidth 
      />
      
      <SelectInput
        source="mediaType"
        label="Tipo de Mídia"
        choices={[
          { id: 'image', name: 'Imagem' },
          { id: 'video', name: 'Vídeo' },
        ]}
        validate={required()}
        defaultValue="image"
      />
      
      <ImageInput
        source="file"
        label="Mídia (Imagem ou Vídeo)"
        accept={{
          'image/*': ['.jpg', '.jpeg', '.png', '.webp'],
          'video/*': ['.mp4', '.webm']
        }}
        validate={required()}
        multiple={false}
      >
        <ImageField source="src" title="title" />
      </ImageInput>
    </SimpleForm>
  </Create>
);