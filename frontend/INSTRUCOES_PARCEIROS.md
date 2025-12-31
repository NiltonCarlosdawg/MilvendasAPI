# 📁 INSTRUÇÕES PARA ADICIONAR LOGOS DE PARCEIROS

## 📍 LOCAL DAS IMAGENS
Coloque os logos dos parceiros na pasta:


## 🖼️ ESPECIFICAÇÕES TÉCNICAS
- **Formato:** PNG ou SVG (transparente preferencial)
- **Dimensões:** Mínimo 200x200 pixels
- **Tamanho:** Máximo 100KB por imagem
- **Nome do arquivo:** Use nomes descritivos (ex: `angonet.png`)

## 🔧 COMO SUBSTITUIR LOGOS FICTÍCIOS

### 1. Prepare as imagens
Coloque os arquivos na pasta `public/partners/`:




### 2. Atualize o array de parceiros
No arquivo `src/components/PartnersCarousel.tsx`, substitua as URLs fictícias:

```javascript
// DE:
{
  id: 1,
  name: 'Angonet',
  logo: 'https://images.unsplash.com/...', // ← REMOVER
  alt: 'Angonet - Parceiro tecnológico',
  website: 'https://angonet.com'
}

// PARA:
{
  id: 1,
  name: 'Angonet',
  logo: '/partners/angonet.png', // ← LOGO REAL
  alt: 'Angonet - Parceiro tecnológico',
  website: 'https://angonet.com'
}