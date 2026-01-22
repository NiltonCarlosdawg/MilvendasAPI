export const consultingTemplate = {
  label: "Consultoria / Insight Técnico",
  subject: "💡 Insight Técnico: {{titulo_insight}}",
  preheader: "Descubra como resolver {{titulo_insight}} com uma análise técnica rápida e prática.", // Aparece na inbox antes do assunto
  requiredFields: ["titulo_insight", "descricao_tecnica", "imagem_evento", "link_agendamento"],

  content: `
<!DOCTYPE html>
<html lang="pt" dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="color-scheme" content="light dark">
  <meta name="supported-color-schemes" content="light dark">
  <title>{{titulo_insight}}</title>

  <style type="text/css">
    body { margin:0; padding:0; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; background:#0f172a; }
    table, td { border-collapse:collapse; }
    img { border:0; height:auto; line-height:100%; outline:none; text-decoration:none; -ms-interpolation-mode:bicubic; max-width:100%; }
    a[x-apple-data-detectors] { color:inherit !important; text-decoration:none !important; font-size:inherit !important; font-family:inherit !important; font-weight:inherit !important; line-height:inherit !important; }

    /* Dark mode overrides */
    @media (prefers-color-scheme: dark) {
      .dark-bg     { background-color: #0f172a !important; }
      .dark-text   { color: #e2e8f0 !important; }
      .dark-muted  { color: #94a3b8 !important; }
      .dark-button-bg { background-color: #f1f5f9 !important; }
      .dark-button-text { color: #0f172a !important; }
    }

    /* Outlook.com dark mode fix */
    [data-ogsc] .dark-bg     { background-color: #0f172a !important; }
    [data-ogsc] .dark-text   { color: #e2e8f0 !important; }
    [data-ogsc] .dark-muted  { color: #94a3b8 !important; }

    /* Mobile adjustments */
    @media only screen and (max-width: 620px) {
      .container { width: 100% !important; }
      .pad { padding: 28px 16px !important; }
      h1 { font-size: 26px !important; line-height: 32px !important; }
      .btn-a { padding: 18px 40px !important; font-size: 16px !important; }
    }
  </style>
</head>

<body style="margin:0; padding:0; background-color:#0f172a;" class="dark-bg">

  <!-- Pré-header invisível -->
  <div style="display:none; font-size:1px; color:#0f172a; line-height:1px; max-height:0px; max-width:0px; opacity:0; overflow:hidden;">
    {{preheader}}
  </div>

  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" bgcolor="#0f172a" class="dark-bg">
    <tr>
      <td align="center" style="padding:40px 10px 60px;">

        <table role="presentation" class="container" width="600" border="0" cellspacing="0" cellpadding="0" style="max-width:600px; background:#ffffff; border-radius:16px; overflow:hidden;" bgcolor="#ffffff">
          <tr>
            <td class="pad" style="padding:48px 40px 56px;">

              <!-- Título -->
              <h1 style="margin:0 0 32px; font-family:Arial,Helvetica,sans-serif; font-size:30px; line-height:36px; color:#0f172a; font-weight:bold; border-left:6px solid #ea2a33; padding-left:16px;" class="dark-text">
                {{titulo_insight}}
              </h1>

              <!-- Imagem principal -->
              <img src="{{imagem_evento}}" width="520" alt="{{titulo_insight}} - Insight Técnico" style="display:block; width:100%; max-width:520px; height:auto; border-radius:12px; margin:0 0 36px;" border="0">

              <!-- Conteúdo -->
              <div style="font-family:Arial,Helvetica,sans-serif; font-size:16px; line-height:28px; color:#1e293b;" class="dark-text">
                {{descricao_tecnica}}
              </div>

              <!-- CTA Button -->
              <table role="presentation" border="0" cellspacing="0" cellpadding="0" style="margin:48px auto 0;">
                <tr>
                  <td align="center">
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="{{link_agendamento}}" style="height:56px;v-text-anchor:middle;width:280px;" arcsize="2000" stroke="f" fill="t">
                      <v:fill type="tile" color="#0f172a" />
                      <w:anchorlock/>
                      <center style="color:#ffffff;font-family:Arial,sans-serif;font-size:16px;font-weight:bold;">Agendar Consultoria Técnica</center>
                    </v:roundrect>
                    <![endif]-->
                    <a href="{{link_agendamento}}"
                       target="_blank" rel="noopener"
                       style="display:inline-block; background:#0f172a; color:#ffffff; font-family:Arial,Helvetica,sans-serif; font-size:16px; font-weight:bold; line-height:24px; padding:18px 48px; border-radius:999px; text-decoration:none; box-sizing:border-box; min-width:220px; text-align:center;"
                       class="btn-a">
                      Agendar Consultoria Técnica
                    </a>
                  </td>
                </tr>
              </table>

              <!-- Texto auxiliar -->
              <p style="margin:40px 0 0; font-family:Arial,Helvetica,sans-serif; font-size:14px; line-height:22px; color:#64748b; text-align:center;" class="dark-muted">
                Precisa de uma avaliação técnica personalizada para o seu negócio?
              </p>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `
};