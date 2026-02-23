// src/resources/portfolio/PortfolioList.tsx
import {
  List, Datagrid, TextField, DateField,
  EditButton, DeleteButton, useRecordContext,
  FunctionField, WrapperField,
} from 'react-admin';
import { ENDPOINTS } from '../../api/endpoints';

const PortfolioMediaField = (_props: { label?: string }) => {
  const record = useRecordContext();
  if (!record?.mediaUrl) return <span>Sem mídia</span>;

  const isVideo = (record.mediaType as string)?.toLowerCase() === 'video';
  const url = `${ENDPOINTS.portfolio}/uploads/${record.mediaUrl}`;

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      {isVideo ? (
        <div style={{
          width: '80px', height: '50px', backgroundColor: '#000', color: '#fff',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '10px', borderRadius: '4px',
        }}>
          VÍDEO
        </div>
      ) : (
        <img
          src={url}
          alt={record.title as string}
          style={{ width: '80px', height: '50px', objectFit: 'cover', borderRadius: '4px' }}
        />
      )}
    </div>
  );
};

export const PortfolioList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} perPage={10}>
    <Datagrid rowClick="edit">
      <PortfolioMediaField label="Mídia" />
      <TextField source="title" label="Título" />
      <FunctionField label="Tipo" render={(record: Record<string, unknown>) => (record.mediaType as string)?.toUpperCase()} />
      <DateField source="createdAt" label="Criado em" locales="pt-BR" showTime={false} />
      <WrapperField label="Ações" textAlign="right">
        <EditButton />
        <DeleteButton mutationMode="pessimistic" />
      </WrapperField>
    </Datagrid>
  </List>
);