import PortfolioService from '../services/PortfolioService.js';

export const getPortfolio = async (req, res) => {
  try {
    const items = await PortfolioService.getAllItems();
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createItem = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "Arquivo obrigatório" });
    const item = await PortfolioService.createItem(req.body, req.file.filename);
    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateItem = async (req, res) => {
  try {
    const updated = await PortfolioService.updateItem(req.params.id, req.body, req.file);
    res.json(updated);
  } catch (error) {
    const status = error.message === "Item não encontrado" ? 404 : 500;
    res.status(status).json({ error: error.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    await PortfolioService.deleteItem(req.params.id);
    res.json({ message: "Item removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};