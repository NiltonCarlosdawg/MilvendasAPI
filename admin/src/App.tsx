import { Admin, Resource } from 'react-admin';
import MailIcon from '@mui/icons-material/Mail';
import authProvider from './authProvider';
import dataProvider from './dataProvider'; // Importa o ficheiro externo corrigido
import { EventList, EventEdit, EventCreate } from './resources/events';
import { PortfolioList, PortfolioCreate, PortfolioEdit } from './resources/portfolio';
import { NewsletterList } from './resources/newsletter/NewsletterList';
import { NewsletterSend } from './resources/newsletter/NewsletterSend';

const App = () => (
  <Admin 
    title="Mil Vendas Admin"
    authProvider={authProvider} 
    dataProvider={dataProvider} // Usa o provider que já trata FormData e Auth
  >
    <Resource 
      name="events" 
      list={EventList} 
      create={EventCreate} 
      edit={EventEdit} 
      options={{ label: 'Eventos' }}
    />
    <Resource
      name="portfolio"
      list={PortfolioList}
      create={PortfolioCreate}
      edit={PortfolioEdit}
      options={{ label: 'Portfólio' }}
    />

    <Resource
      name="newsletter"
      list={NewsletterList}
      create={NewsletterSend} // Clicar em "Criar" vai para a tela de Envio
      options={{ label: 'Newsletter' }}
      icon={MailIcon}
    />
  </Admin>
);

export default App;