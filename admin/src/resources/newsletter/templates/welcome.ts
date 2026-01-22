export const welcomeTemplate = {
  label: "Boas-vindas (Tech & Serviços)",
  subject: "Bem-vindo à MilVendas – Inovação Tecnológica à sua medida",
  requiredFields: ["nome_cliente", "servico_interesse"],
  content: `
    <div style="background-color: #f8f6f6; padding: 40px 10px; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center">
            <div style="max-width: 600px; background-color: #ffffff; border-radius: 2rem; overflow: hidden; box-shadow: 0 10px 15px rgba(0,0,0,0.05);">
              <div style="background-color: #211111; padding: 40px; text-align: center;">
                <span style="color: #ea2a33; font-weight: 800; font-size: 24px;">MilVendas</span>
                <p style="color: #ffffff; font-size: 12px; margin-top: 5px; opacity: 0.8; letter-spacing: 2px;">TECNOLOGIA & CONSULTORIA</p>
              </div>
              <div style="padding: 40px; text-align: center;">
                <h1 style="font-size: 32px; font-weight: 800; color: #211111; margin: 0 0 16px 0;">Olá, {{nome_cliente}}!</h1>
                <p style="font-size: 16px; color: #475569; line-height: 1.8; margin-bottom: 24px;">
                  É um prazer tê-lo na nossa rede. Na <strong>MilVendas</strong>, transformamos desafios técnicos em soluções de alta performance, desde softwares personalizados até consultoria estratégica.
                </p>
                <div style="background-color: #f8fafc; border-left: 4px solid #ea2a33; padding: 20px; text-align: left; margin-bottom: 30px;">
                  <p style="margin: 0; color: #211111; font-weight: 600;">Especialidade em destaque:</p>
                  <p style="margin: 5px 0 0 0; color: #ea2a33; font-size: 18px; font-weight: 700;">{{servico_interesse}}</p>
                </div>
                <a href="https://milvendas.ao" style="background-color: #ea2a33; color: #ffffff; padding: 18px 32px; border-radius: 9999px; text-decoration: none; font-weight: 700; display: inline-block;">Conheça os nossos Cases</a>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `
};