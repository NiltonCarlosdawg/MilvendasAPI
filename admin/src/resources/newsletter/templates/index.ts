// src/resources/newsletter/templates/index.ts

import { welcomeTemplate } from './welcome';
import { portfolioTemplate } from './portfolio';
import { promoTemplate } from './promo';
import { consultingTemplate } from './consultoria'; // O ficheiro que criámos no passo anterior

export interface NewsletterTemplate {
  label: string;
  subject: string;
  requiredFields: string[];
  content: string;
}

export const newsletterTemplates: Record<string, NewsletterTemplate> = {
  welcome: welcomeTemplate,
  portfolio: portfolioTemplate,
  promocao_tech: promoTemplate,
  consultoria: consultingTemplate, // AGORA DISPONÍVEL NO FRONTEND
};