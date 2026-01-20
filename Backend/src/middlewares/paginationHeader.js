// src/middlewares/paginationHeader.js
export const addPaginationHeaders = (req, res, next) => {
  // Intercepta apenas respostas de listagem (GET sem ID)
  if (req.method === 'GET' && !req.params.id && res.locals.total !== undefined) {
    const range = req.get('Range') || 'items=0-9'; // default se não vier
    const match = range.match(/items=(\d+)-(\d+)/);
    
    if (match) {
      const start = parseInt(match[1]);
      const end = parseInt(match[2]);
      const total = res.locals.total || 0; // total deve ser setado no controller

      // Define o header Content-Range
      res.set('Content-Range', `items ${start}-${Math.min(end, total-1)}/${total}`);
      
      // Expoe o header para o frontend ler
      res.set('Access-Control-Expose-Headers', 'Content-Range, X-Total-Count');
      
      // Opcional: também envia X-Total-Count (compatibilidade extra)
      res.set('X-Total-Count', total.toString());
    }
  }

  next();
};