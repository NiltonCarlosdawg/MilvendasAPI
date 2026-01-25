
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Raiz do projeto (um nível acima de src/)
const PROJECT_ROOT = path.join(__dirname, '..');

// Pastas de upload (absolutas)
export const UPLOAD_ROOT = path.join(PROJECT_ROOT, 'uploads');
export const PORTFOLIO_UPLOAD = UPLOAD_ROOT;
export const EVENTS_UPLOAD = path.join(UPLOAD_ROOT, 'events');

export default {
  UPLOAD_ROOT,
  PORTFOLIO_UPLOAD,
  EVENTS_UPLOAD
};