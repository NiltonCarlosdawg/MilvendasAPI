// src/App.tsx
import { Admin, Resource } from 'react-admin';
import MailIcon from '@mui/icons-material/Mail';
import EventIcon from '@mui/icons-material/Event';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';

import authProvider from './authProvider';
import dataProvider from './dataProvider';
import LoginPage from './pages/LoginPage';
import { mvTheme } from './theme/mvTheme';

import { EventList, EventEdit, EventCreate } from './resources/events';
import { PortfolioList, PortfolioCreate, PortfolioEdit } from './resources/portfolio';
import { NewsletterList } from './resources/newsletter/NewsletterList';
import { NewsletterSend } from './resources/newsletter/NewsletterSend';

const App = () => (
  <Admin
    title="Mil Vendas Admin"
    authProvider={authProvider}
    dataProvider={dataProvider}
    loginPage={LoginPage}
    theme={mvTheme}
    disableTelemetry
  >
    <Resource
      name="events"
      list={EventList}
      create={EventCreate}
      edit={EventEdit}
      options={{ label: 'Eventos' }}
      icon={EventIcon}
    />
    <Resource
      name="portfolio"
      list={PortfolioList}
      create={PortfolioCreate}
      edit={PortfolioEdit}
      options={{ label: 'Portfólio' }}
      icon={PhotoLibraryIcon}
    />
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