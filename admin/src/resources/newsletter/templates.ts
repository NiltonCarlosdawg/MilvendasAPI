export interface NewsletterTemplate {
  label: string;
  subject: string;
  requiredFields: string[];
  content: string;
}

const footerHtml = `
  <div style="background-color: #f8f6f6; padding: 40px 20px; text-align: center; border-top: 1px solid #e2e8f0; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
    <p style="color: #64748b; font-size: 12px; margin-bottom: 10px;">
      Você está a receber este e-mail porque se inscreveu em milvendas.ao
    </p>
    <div style="margin-bottom: 20px;">
      <a href="https://milvendas.ao" style="color: #ea2a33; font-weight: bold; text-decoration: none; font-size: 14px;">www.milvendas.ao</a>
    </div>
  </div>
`;

export const newsletterTemplates: Record<string, NewsletterTemplate> = {
  // BASEADO NO 4.HTML
  welcome: {
    label: "Boas-vindas (Template 4)",
    subject: "Bem-vindo à MilVendas! 🎉",
    requiredFields: ["nome_usuario", "codigo_desconto"],
    content: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f6f6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 2rem; overflow: hidden; border: 1px solid #e2e8f0;">
          <div style="padding: 60px 40px; text-align: center;">
            <div style="background-color: #fee2e2; color: #ea2a33; display: inline-block; padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 24px;">COMUNIDADE MILVENDAS</div>
            <h1 style="font-size: 42px; font-weight: 800; color: #211111; margin: 0 0 16px 0;">Olá, {{nome_usuario}}!</h1>
            <p style="font-size: 18px; color: #64748b; margin-bottom: 32px;">Usa o cupom abaixo para a tua primeira compra:</p>
            <div style="background-color: #f8fafc; border: 2px dashed #ea2a33; padding: 24px; border-radius: 1rem; margin-bottom: 32px;">
              <span style="font-size: 32px; font-weight: 800; color: #ea2a33; letter-spacing: 4px;">{{codigo_desconto}}</span>
            </div>
            <a href="https://milvendas.ao" style="background-color: #ea2a33; color: white; padding: 18px 35px; border-radius: 9999px; text-decoration: none; font-weight: bold; display: inline-block;">Começar a Explorar</a>
          </div>
          ${footerHtml}
        </div>
      </div>
    `
  },

  // BASEADO NO 1.HTML / 3.HTML
  portfolio_update: {
    label: "Portfólio / Novo Projeto (Template 1/3)",
    subject: "🎨 Novo no Portfólio: {{projeto_nome}}",
    requiredFields: ["projeto_nome", "categoria", "descricao_curta", "imagem_evento", "link_projeto"],
    content: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f6f6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 2rem; overflow: hidden; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
          <img src="{{imagem_evento}}" style="width: 100%; height: auto; display: block;" />
          <div style="padding: 40px;">
            <span style="color: #ea2a33; font-weight: bold; font-size: 12px; text-transform: uppercase;">{{categoria}}</span>
            <h2 style="font-size: 32px; color: #211111; margin: 12px 0;">{{projeto_nome}}</h2>
            <p style="color: #64748b; line-height: 1.8; font-size: 16px; margin-bottom: 32px;">{{descricao_curta}}</p>
            <a href="{{link_projeto}}" style="color: #ea2a33; font-weight: bold; text-decoration: none; font-size: 16px;">Ver Estudo de Caso →</a>
          </div>
          ${footerHtml}
        </div>
      </div>
    `
  },

  // BASEADO NO 5.HTML
  oferta_imperdivel: {
    label: "Oferta Imperdível (Template 5)",
    subject: "🔥 OFERTA: {{nome_produto}}",
    requiredFields: ["nome_produto", "preco_antigo", "preco_novo", "imagem_evento", "link_compra"],
    content: `
      <div style="font-family: Arial, sans-serif; background-color: #f8f6f6; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #211111; border-radius: 2rem; overflow: hidden; color: white; text-align: center;">
          <img src="{{imagem_evento}}" style="width: 100%; height: auto; display: block;" />
          <div style="padding: 60px 40px;">
            <div style="background-color: #ea2a33; display: inline-block; padding: 8px 16px; border-radius: 9999px; font-size: 12px; font-weight: bold; margin-bottom: 25px;">OFERTA LIMITADA</div>
            <h1 style="font-size: 42px; font-weight: 800; margin: 0 0 10px 0;">{{nome_produto}}</h1>
            <div style="margin: 30px 0;">
              <div style="text-decoration: line-through; color: #94a3b8; font-size: 20px;">De: {{preco_antigo}}</div>
              <div style="font-size: 64px; font-weight: 800; color: #ea2a33; margin-top: 5px;">{{preco_novo}}</div>
            </div>
            <a href="{{link_compra}}" style="background-color: #ea2a33; color: white; display: block; padding: 20px; border-radius: 9999px; text-decoration: none; font-weight: bold; font-size: 20px;">APROVEITAR AGORA</a>
          </div>
          <div style="padding: 30px; border-top: 1px solid #333; font-size: 11px; color: #666;">*Oferta válida por tempo limitado.</div>
        </div>
      </div>
    `
  },

  // BASEADO NO 2.HTML
  newsletter_geral: {
    label: "Newsletter Geral (Template 2)",
    subject: "MilVendas News: {{titulo_news}}",
    requiredFields: ["titulo_news", "texto_informativo", "imagem_evento", "link_news"],
    content: `
      <div style="font-family: Arial, sans-serif; background-color: #ffffff; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; border: 1px solid #f1f5f9; border-radius: 1rem; overflow: hidden;">
          <div style="padding: 40px;">
            <h1 style="font-size: 32px; color: #211111; border-left: 5px solid #ea2a33; padding-left: 20px; margin-bottom: 30px;">{{titulo_news}}</h1>
            <img src="{{imagem_evento}}" style="width: 100%; border-radius: 1rem; margin-bottom: 30px;" />
            <p style="font-size: 16px; color: #475569; line-height: 1.8; margin-bottom: 30px;">{{texto_informativo}}</p>
            <a href="{{link_news}}" style="color: #ea2a33; font-weight: bold; text-decoration: none;">Ler notícia completa →</a>
          </div>
          ${footerHtml}
        </div>
      </div>
    `
  }
};