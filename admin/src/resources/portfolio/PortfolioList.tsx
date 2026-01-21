import { 
  List, 
  Datagrid, 
  TextField, 
  DateField, 
  EditButton, 
  DeleteButton, 
  useRecordContext,
  FunctionField,
  WrapperField
} from 'react-admin';

/**
 * Componente para exibir a miniatura da mídia.
 * Suporta imagens e exibe um ícone/texto para vídeos.
 */
const PortfolioMediaField = ({ label }: { label?: string }) => {
  const record = useRecordContext();
  if (!record?.mediaUrl) return <span>Sem mídia</span>;

  const isVideo = record.mediaType?.toLowerCase() === 'video';
  const url = `http://localhost:3001/uploads/${record.mediaUrl}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isVideo ? (
        <div style={{ 
          width: '80px', 
          height: '50px', 
          backgroundColor: '#000', 
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '10px',
          borderRadius: '4px'
        }}>
          VÍDEO
        </div>
      ) : (
        <img
          src={url}
          alt={record.title}
          style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )}
    </div>
  );
};

export const PortfolioList = () => (
  <List 
    sort={{ field: 'createdAt', order: 'DESC' }}
    perPage={10} // Define explicitamente para bater com o Range do backend
  >
    <Datagrid rowClick="edit">
      <PortfolioMediaField label="Mídia" />
      
      <TextField source="title" label="Título" />
      
      <FunctionField
        label="Tipo"
        render={(record: any) => record.mediaType?.toUpperCase()}
      />

      <DateField 
        source="createdAt" 
        label="Criado em" 
        locales="pt-BR" 
        showTime={false}
      />
      
      <WrapperField label="Ações" textAlign="right">
        <EditButton />
        <DeleteButton mutationMode="pessimistic" />
      </WrapperField>
    </Datagrid>
  </List>
);