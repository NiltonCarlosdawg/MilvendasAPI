// src/resources/newsletter/templates/promo.ts

export const promoTemplate = {
  label: "Oferta de Serviços Tech (Design 5.html)",
  subject: "🚀 Oportunidade: {{titulo_oferta}} – MilVendas Tech",
  requiredFields: [
    "titulo_oferta", 
    "descricao_servico", 
    "preco_original", 
    "preco_com_desconto", 
    "imagem_evento", 
    "cta_texto"
  ],
  content: `
    <div style="margin: 0; padding: 0; background-color: #f8f6f6; font-family: 'Plus Jakarta Sans', Arial, sans-serif;">
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
        <tr>
          <td align="center" style="padding: 40px 10px;">
            <div style="max-width: 600px; background-color: #211111; border-radius: 2rem; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5);">
              
              <div style="width: 100%; height: auto; overflow: hidden;">
                <img src="{{imagem_evento}}" alt="Tech Solution" style="width: 100%; height: auto; display: block;" />
              </div>

              <div style="padding: 50px 40px; text-align: center; color: #ffffff;">
                <div style="background-color: #ea2a33; display: inline-block; padding: 6px 16px; border-radius: 9999px; font-size: 11px; font-weight: 800; margin-bottom: 24px; text-transform: uppercase; letter-spacing: 1px;">
                  Oferta de Consultoria / Software
                </div>
                
                <h1 style="font-size: 38px; font-weight: 800; color: #ffffff; margin: 0 0 16px 0; line-height: 1.1;">
                  {{titulo_oferta}}
                </h1>
                
                <p style="font-size: 16px; line-height: 1.6; color: #94a3b8; margin-bottom: 32px;">
                  {{descricao_servico}}
                </p>

                <div style="margin-bottom: 40px;">
                  <div style="text-decoration: line-through; color: #64748b; font-size: 18px; margin-bottom: 4px;">
                    Valor Original: {{preco_original}}
                  </div>
                  <div style="font-size: 56px; font-weight: 800; color: #ea2a33;">
                    {{preco_com_desconto}}
                  </div>
                  <p style="font-size: 12px; color: #64748b; margin-top: 8px;">*Condições exclusivas para subscritores MilVendas</p>
                </div>

                <a href="https://milvendas.ao/contacto" style="background-color: #ea2a33; color: #ffffff; width: 100%; padding: 20px; border-radius: 9999px; text-decoration: none; font-weight: 800; font-size: 18px; display: block; box-shadow: 0 10px 15px -3px rgba(234, 42, 51, 0.4);">
                  {{cta_texto}}
                </a>
              </div>

              <div style="padding: 30px; border-top: 1px solid #334155; text-align: center; background-color: rgba(255,255,255,0.02);">
                <div style="margin-bottom: 15px;">
                  <span style="color: #ea2a33; font-weight: 800;">MilVendas</span>
                  <span style="color: #94a3b8; font-size: 12px; margin-left: 10px;">Innovation & Trust</span>
                </div>
                <p style="color: #64748b; font-size: 11px; margin: 0;">
                  © 2026 MilVendas - Luanda, Angola. Todos os direitos reservados.
                </p>
              </div>
            </div>
          </td>
        </tr>
      </table>
    </div>
  `
};