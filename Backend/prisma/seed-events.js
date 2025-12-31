import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedEvents() {
  console.log('🌱 Iniciando seed de eventos...\n');

  try {
    // ========================================
    // 1. EVENTO PRÓPRIO - Festival de Música
    // ========================================
    const festival = await prisma.event.upsert({
      where: { slug: 'festival-de-musica-luanda-2025' },
      update: {},
      create: {
        title: 'Festival de Música Luanda 2025',
        slug: 'festival-de-musica-luanda-2025',
        eventType: 'OWN',
        status: 'PUBLISHED',
        descriptionShort: 'O maior festival de música de Angola! Três dias de shows com artistas nacionais e internacionais.',
        descriptionLong: `
          <h2>Sobre o Festival</h2>
          <p>Prepare-se para viver três dias inesquecíveis de muita música, diversão e entretenimento!</p>
          
          <h3>Line-up Confirmado</h3>
          <ul>
            <li>Artistas internacionais de renome</li>
            <li>Os melhores talentos nacionais</li>
            <li>DJs residentes</li>
            <li>Shows surpresa</li>
          </ul>
          
          <h3>Estrutura</h3>
          <ul>
            <li>4 palcos simultâneos</li>
            <li>Área VIP com camarotes</li>
            <li>Praça de alimentação completa</li>
            <li>Estacionamento privativo</li>
            <li>Segurança 24h</li>
          </ul>
        `,
        eventDate: new Date('2025-08-15T18:00:00Z'),
        eventEndDate: new Date('2025-08-17T23:59:59Z'),
        location: 'Estádio da Cidadela',
        address: 'Rua Direita da Cidadela, Luanda',
        capacity: 10000,
        allowTicketRequest: true,
        externalLink: null
      }
    });
    console.log('✅ Festival de Música criado:', festival.title);

    // ========================================
    // 2. EVENTO PRÓPRIO - Conferência Tech
    // ========================================
    const conference = await prisma.event.upsert({
      where: { slug: 'conferencia-tech-angola-2025' },
      update: {},
      create: {
        title: 'Conferência Tech Angola 2025',
        slug: 'conferencia-tech-angola-2025',
        eventType: 'OWN',
        status: 'PUBLISHED',
        descriptionShort: 'O maior evento de tecnologia e inovação de Angola.',
        descriptionLong: `
          <h2>Sobre a Conferência</h2>
          <p>Dois dias de palestras, workshops e networking com os maiores nomes da tecnologia.</p>
          
          <h3>Temas Principais</h3>
          <ul>
            <li>Inteligência Artificial</li>
            <li>Blockchain e Criptomoedas</li>
            <li>Desenvolvimento de Software</li>
            <li>Startups e Empreendedorismo</li>
          </ul>
        `,
        eventDate: new Date('2025-10-10T09:00:00Z'),
        eventEndDate: new Date('2025-10-11T18:00:00Z'),
        location: 'Centro de Convenções de Talatona',
        address: 'Talatona, Luanda',
        capacity: 500,
        allowTicketRequest: true
      }
    });
    console.log('✅ Conferência Tech criada:', conference.title);

    // ========================================
    // 3. EVENTO DE TERCEIROS - FILDA
    // ========================================
    const filda = await prisma.event.upsert({
      where: { slug: 'filda-2025' },
      update: {},
      create: {
        title: 'FILDA 2025',
        slug: 'filda-2025',
        eventType: 'THIRD_PARTY',
        status: 'PUBLISHED',
        descriptionShort: 'Feira Internacional de Luanda - A Mil Vendas estará presente com stand exclusivo!',
        descriptionLong: `
          <h2>Sobre a FILDA</h2>
          <p>A maior feira de negócios de Angola. Visitantes de todo o mundo para networking e novos negócios.</p>
          
          <h3>Nossa Participação</h3>
          <p>Estaremos no Pavilhão 3, Stand 42, apresentando nossos últimos projetos e serviços.</p>
          <p>Venha nos visitar e conhecer nossas soluções!</p>
        `,
        eventDate: new Date('2025-09-10T09:00:00Z'),
        eventEndDate: new Date('2025-09-15T18:00:00Z'),
        location: 'Ilha de Luanda',
        address: 'Ilha do Cabo, Luanda',
        organizerName: 'FILDA - Organização',
        organizerContact: 'contato@filda.ao',
        allowTicketRequest: false,
        externalLink: 'https://filda.ao'
      }
    });
    console.log('✅ FILDA criada:', filda.title);

    // ========================================
    // 4. EVENTO DE TERCEIROS - Workshop Marketing
    // ========================================
    const workshop = await prisma.event.upsert({
      where: { slug: 'workshop-marketing-digital-2025' },
      update: {},
      create: {
        title: 'Workshop Marketing Digital 2025',
        slug: 'workshop-marketing-digital-2025',
        eventType: 'THIRD_PARTY',
        status: 'PUBLISHED',
        descriptionShort: 'Workshop intensivo sobre estratégias de marketing digital. Mil Vendas como patrocinadora!',
        eventDate: new Date('2025-07-05T14:00:00Z'),
        eventEndDate: new Date('2025-07-05T18:00:00Z'),
        location: 'Hotel Epic Sana',
        address: 'Av. 4 de Fevereiro, Luanda',
        organizerName: 'Marketing Academy Angola',
        capacity: 100,
        allowTicketRequest: false,
        externalLink: 'https://marketingacademy.ao/workshop'
      }
    });
    console.log('✅ Workshop criado:', workshop.title);

    // ========================================
    // 5. EVENTO PRÓPRIO - RASCUNHO
    // ========================================
    const draft = await prisma.event.upsert({
      where: { slug: 'festa-de-fim-de-ano-2025' },
      update: {},
      create: {
        title: 'Festa de Fim de Ano 2025',
        slug: 'festa-de-fim-de-ano-2025',
        eventType: 'OWN',
        status: 'DRAFT',
        descriptionShort: 'Grande festa de encerramento do ano (em breve mais informações)',
        eventDate: new Date('2025-12-31T21:00:00Z'),
        location: 'A definir',
        allowTicketRequest: false
      }
    });
    console.log('✅ Evento Draft criado:', draft.title);

    // ========================================
    // CRIAR ALGUMAS SOLICITAÇÕES DE TESTE
    // ========================================
    console.log('\n🎫 Criando solicitações de ingresso de teste...');

    await prisma.eventTicketRequest.createMany({
      data: [
        {
          eventId: festival.id,
          name: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '+244 923 456 789',
          quantity: 2,
          message: 'Gostaria de 2 ingressos VIP, por favor.',
          status: 'pending'
        },
        {
          eventId: festival.id,
          name: 'Maria Santos',
          email: 'maria.santos@email.com',
          phone: '+244 912 345 678',
          quantity: 4,
          message: 'Preciso de 4 ingressos para o segundo dia.',
          status: 'contacted'
        },
        {
          eventId: conference.id,
          name: 'Pedro Costa',
          email: 'pedro.costa@email.com',
          phone: '+244 934 567 890',
          quantity: 1,
          message: 'Interesse no workshop de IA.',
          status: 'confirmed'
        }
      ]
    });
    console.log('✅ Solicitações de ingresso criadas\n');

    // ========================================
    // ESTATÍSTICAS
    // ========================================
    const totalEvents = await prisma.event.count();
    const publishedEvents = await prisma.event.count({ where: { status: 'PUBLISHED' } });
    const ownEvents = await prisma.event.count({ where: { eventType: 'OWN' } });
    const ticketRequests = await prisma.eventTicketRequest.count();

    console.log('📊 ESTATÍSTICAS:');
    console.log(`   Total de eventos: ${totalEvents}`);
    console.log(`   Eventos publicados: ${publishedEvents}`);
    console.log(`   Eventos próprios: ${ownEvents}`);
    console.log(`   Solicitações de ingresso: ${ticketRequests}`);

    console.log('\n✅ Seed de eventos concluído com sucesso!');

  } catch (error) {
    console.error('❌ Erro ao criar seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedEvents();