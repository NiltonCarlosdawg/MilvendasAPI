// src/hooks/useContent.ts
// Hook separado do ContentContext para satisfazer react-refresh/only-export-components
import { useContext } from 'react';
import { ContentContext } from '../context/ContentContext';

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};