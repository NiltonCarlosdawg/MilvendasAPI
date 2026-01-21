import portfolioService from '../services/PortfolioService.js';

/**
 * Buscar todos os itens (Listagem)
 * CORREÇÃO: Adicionado res.locals.total para o middleware addPaginationHeaders
 */
export const getPortfolio = async (req, res) => {
  try {
    const items = await portfolioService.getAllItems();
    
    // ESSA LINHA É OBRIGATÓRIA: O seu middleware paginationHeader.js 
    // depende de res.locals.total para gerar o header Content-Range.
    res.locals.total = items.length; 
    
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Buscar um item por ID
 */
export const getPortfolioById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = await portfolioService.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: "Item não encontrado" });
    }
    res.json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Criar novo item
 * CORREÇÃO: Validação rigorosa dos campos e do ficheiro
 */
export const createItem = async (req, res) => {
  try {
    // 1. Validação do ficheiro (Multer insere em req.file)
    if (!req.file) {
      return res.status(400).json({ 
        error: "Arquivo obrigatório",
        message: "É necessário enviar uma imagem ou vídeo através do campo 'file'" 
      });
    }

    // 2. Validação dos campos obrigatórios enviados via FormData
    const { title, description, mediaType } = req.body;
    
    if (!title || !description || !mediaType) {
      return res.status(400).json({ 
        error: "Campos obrigatórios ausentes",
        message: "title, description e mediaType são obrigatórios no corpo da requisição" 
      });
    }

    // 3. Persistência no banco através do serviço
    const item = await portfolioService.createItem(req.body, req.file.filename);
    res.status(201).json(item);
  } catch (error) {
    console.error('Erro ao criar item no Portfolio:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Atualizar item
 * CORREÇÃO: Suporte a atualização opcional de ficheiro
 */
export const updateItem = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Convertemos campos numéricos se existirem (ex: order)
    const updateData = { ...req.body };
    if (updateData.order) updateData.order = parseInt(updateData.order, 10);

    // O service deve decidir se usa o req.file (se houver novo upload) 
    // ou mantém a imagem antiga
    const updated = await portfolioService.updateItem(
      id, 
      updateData, 
      req.file // Pode ser undefined se o ficheiro não foi alterado
    );
    
    if (!updated) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    res.json(updated);
  } catch (error) {
    console.error('Erro no PUT /portfolio:', error);
    res.status(500).json({ error: error.message });
  }
};

/**
 * Deletar item
 */
export const deleteItem = async (req, res) => {
  try {
    const { id } = req.params;
    await portfolioService.deleteItem(id);
    
    // React Admin espera o ID do objeto removido no retorno
    res.json({ id }); 
  } catch (error) {
    console.error('Erro ao deletar item no Portfolio:', error);
    res.status(500).json({ error: error.message });
  }
};