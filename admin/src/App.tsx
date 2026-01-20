// src/App.tsx
import { Admin, Resource } from 'react-admin';
import simpleRestProvider from 'ra-data-simple-rest';
import authProvider from './authProvider';

// Importa os componentes do resource de eventos (já criados na pasta resources/events)
import { EventList, EventEdit, EventCreate } from './resources/events';

// URL base da sua API (ajuste se mudar a porta ou deployar)
const apiUrl = 'http://localhost:3001/api/v1';

const dataProvider = simpleRestProvider(apiUrl, {
  // Adiciona o token JWT automaticamente em todas as requisições
  httpClient: async (url, options = {}) => {
    if (!options.headers) {
      options.headers = new Headers({ Accept: 'application/json' });
    }
    const token = localStorage.getItem('token');
    if (token) {
      options.headers.set('Authorization', `Bearer ${token}`);
    }
    const response = await fetch(url, options);
    if (response.status >= 200 && response.status < 300) {
      const json = await response.json();
      return { status: response.status, body: json };
    }
    throw new Error(response.statusText);
  },
});

const App = () => (
  <Admin
    authProvider={authProvider}
    dataProvider={dataProvider}
    title="Mil Vendas Admin"
    // Opcional: dashboard customizado no futuro
    // dashboard={Dashboard}
  >
    {/* Resource de Eventos */}
    <Resource
      name="events"
      list={EventList}
      edit={EventEdit}
      create={EventCreate}
      // icon={<EventIcon />} // descomente se adicionar ícones do MUI
    />

    {/* Adicione outros resources aqui nas próximas fases */}
    {/* <Resource name="portfolio" list={PortfolioList} ... /> */}
    {/* <Resource name="newsletter" list={NewsletterList} ... /> */}
  </Admin>
);

export default App;