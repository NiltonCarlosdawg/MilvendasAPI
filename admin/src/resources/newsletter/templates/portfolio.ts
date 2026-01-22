// src/resources/newsletter/templates/portfolio.ts

export const portfolioTemplate = {
  label: "Estudo de Caso / Software (Design 3.html)",
  subject: "🚀 Novo Case: {{nome_projeto}} – Soluções MilVendas",
  requiredFields: [
    "nome_projeto", 
    "categoria_tech", 
    "descricao_curta", 
    "tecnologias_usadas", 
    "imagem_evento", 
    "link_projeto"
  ],
  content: `
    <div style="margin: 0; padding: 0; background-color: #f8f6f6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <div style="max-width: 600px; background-color: #ffffff; border-radius: 2rem; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 20px 25px -5px rgba(0,0,0,0.1);">
              
              <div style="width: 100%; height: auto; position: relative;">
                <img src="{{imagem_evento}}" alt="{{nome_projeto}}" style="width: 100%; height: auto; display: block;" />
              </div>

              <div style="padding: 40px;">
                <div style="display: flex; align-items: center; margin-bottom: 16px;">
                  <span style="background-color: #fee2e2; color: #ea2a33; padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">
                    {{categoria_tech}}
                  </span>
                </div>

                <h2 style="font-size: 28px; font-weight: 800; color: #211111; margin: 0 0 12px 0; line-height: 1.2;">
                  {{nome_projeto}}
                </h2>

                <p style="font-size: 16px; line-height: 1.6; color: #475569; margin-bottom: 24px;">
                  {{descricao_curta}}
                </p>

                <div style="border-top: 1px solid #f1f5f9; padding-top: 24px; margin-bottom: 32px;">
                  <p style="font-size: 12px; font-weight: 700; color: #94a3b8; text-transform: uppercase; margin-bottom: 8px;">Tecnologias & Frameworks</p>
                  <p style="font-size: 14px; color: #211111; font-weight: 500;">{{tecnologias_usadas}}</p>
                </div>

                <div style="text-align: left;">
                  <a href="{{link_projeto}}" style="background-color: #ea2a33; color: #ffffff; padding: 16px 32px; border-radius: 9999px; text-decoration: none; font-weight: 700; font-size: 14px; display: inline-block;">
                    Ver Estudo de Caso Completo
                  </a>
                </div>
              </div>

              <div style="background-color: #f8f6f6; padding: 30px; text-align: center;">
                <p style="color: #94a3b8; font-size: 11px; margin: 0;">
                  Desenvolvido pela Equipa Técnica da <strong>MilVendas</strong>.<br>
                  Transformando ideias em código de alta performance.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `
};