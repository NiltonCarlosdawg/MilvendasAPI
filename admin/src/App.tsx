import { Admin, Resource} from 'react-admin';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

// Configurações de Autenticação e Dados
import authProvider from './authProvider';
import dataProvider from './dataProvider';

// Customização Visual
import LoginPage from './pages/LoginPage'; // A página estilizada que criámos

// Componentes de Recursos
import { EventList, EventEdit, EventCreate } from './resources/events';
import { PortfolioList, PortfolioCreate, PortfolioEdit } from './resources/portfolio';
import { NewsletterList } from './resources/newsletter/NewsletterList';
import { NewsletterSend } from './resources/newsletter/NewsletterSend';

const App = () => (
  <Admin 
    title="Mil Vendas Admin"
    authProvider={authProvider} 
    dataProvider={dataProvider}
    loginPage={LoginPage} // Ativa a nova tela de login estilizada
    disableTelemetry // Opcional: remove o aviso de telemetria do react-admin no console
  >
    {/* 1. Recurso de Eventos */}
    <Resource 
      name="events" 
      list={EventList} 
      create={EventCreate} 
      edit={EventEdit} 
      options={{ label: 'Eventos' }}
      icon={EventIcon}
    />

    {/* 2. Recurso de Portfólio */}
    <Resource
      name="portfolio"
      list={PortfolioList}
      create={PortfolioCreate}
      edit={PortfolioEdit}
      options={{ label: 'Portfólio' }}
      icon={PhotoLibraryIcon}
    />

    {/* 3. Recurso de Newsletter */}
    <Resource
      name="newsletter"
      list={NewsletterList}
      create={NewsletterSend}
      options={{ label: 'Newsletter' }}
      icon={MailIcon}
    />
  </Admin>
);

export default App;