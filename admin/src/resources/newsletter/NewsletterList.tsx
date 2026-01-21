import { 
  List, 
  Datagrid, 
  DateField, 
  BooleanField, 
  EmailField,
  DeleteButton 
} from 'react-admin';

export const NewsletterList = () => (
  <List sort={{ field: 'createdAt', order: 'DESC' }} title="Assinantes da Newsletter">
    <Datagrid bulkActionButtons={false}>
      <EmailField source="email" label="Email" />
      
      <BooleanField source="active" label="Ativo?" />
      
      <DateField 
        source="createdAt" 
        label="Inscrito em" 
        locales="pt-BR" 
        showTime 
      />
      
      {/* O backend precisa suportar DELETE /newsletter/:id para isto funcionar */}
      <DeleteButton mutationMode="pessimistic" />
    </Datagrid>
  </List>
);