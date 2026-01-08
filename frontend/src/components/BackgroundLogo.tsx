// src/components/BackgroundLogo.tsx
import logoMv from '../assets/logo-mv.svg';

const BackgroundLogo = () => {
  return (
    <div className="fixed inset-0 z-[-1] flex items-center justify-center pointer-events-none overflow-hidden select-none">
      {/* O logotipo gigante e sutil */}
      <img 
        src={logoMv} 
        alt="" 
        className="w-[80vw] md:w-[50vw] opacity-[0.03] dark:opacity-[0.05] filter grayscale brightness-50"
      />
      
      {/* Efeito de Gradiente para suavizar as bordas do logo */}
      <div className="absolute inset-0 bg-gradient-to-b from-white via-transparent to-white dark:from-slate-950 dark:via-transparent dark:to-slate-950" />
    </div>
  );
};

export default BackgroundLogo;