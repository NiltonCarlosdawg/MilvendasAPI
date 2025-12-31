import React, { useState } from 'react';
import AddEventModal from './AddEventModal'; // Ajuste o caminho conforme necessário
import AddPortfolioModal from './AddPortfolioModal'; // Ajuste o caminho conforme necessário

const QuickActions: React.FC = () => {
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isPortfolioModalOpen, setIsPortfolioModalOpen] = useState(false);

  // Funções de sucesso para recarregar dados se necessário
  const handleSuccess = () => {
    // Aqui você pode disparar um reload global ou apenas fechar
    console.log("Criado com sucesso!");
  };

  return (
    <>
      <div className="bg-blue-600 rounded-3xl p-8 text-white relative overflow-hidden shadow-xl shadow-blue-500/20">
        {/* Decoração de fundo para um visual mais moderno */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 bg-white rounded-full opacity-10 blur-2xl"></div>

        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">Precisa de publicar algo agora?</h2>
          <p className="text-blue-100 mb-6">Crie um novo evento ou adicione um item ao portfólio em segundos.</p>
          
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => setIsEventModalOpen(true)}
              className="px-6 py-3 bg-white text-blue-600 rounded-xl font-bold hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Novo Evento
            </button>
            <button 
              onClick={() => setIsPortfolioModalOpen(true)}
              className="px-6 py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all hover:scale-105 active:scale-95 shadow-lg"
            >
              Novo Projeto
            </button>
          </div>
        </div>
      </div>

      {/* Renderização condicional dos Modais */}
      {isEventModalOpen && (
        <AddEventModal 
          onClose={() => setIsEventModalOpen(false)} 
          onSuccess={handleSuccess} 
        />
      )}

      {isPortfolioModalOpen && (
        <AddPortfolioModal 
          onClose={() => setIsPortfolioModalOpen(false)} 
          onSuccess={handleSuccess} 
        />
      )}
    </>
  );
};

export default QuickActions;