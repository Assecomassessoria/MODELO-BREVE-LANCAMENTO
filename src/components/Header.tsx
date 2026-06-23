import React from 'react';
import { Building2, PhoneCall, Sparkles } from 'lucide-react';

interface HeaderProps {
  onRegisterClick: () => void;
}

export default function Header({ onRegisterClick }: HeaderProps) {
  return (
    <header className="absolute top-0 left-0 w-full z-20 px-6 py-4 sm:px-12 flex justify-between items-center bg-gradient-to-b from-slate-950/80 to-transparent backdrop-blur-[2px]">
      {/* Brand logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
          <Building2 className="w-5 h-5" />
        </div>
        <div>
          <span className="font-serif text-lg tracking-widest text-white block leading-none">
            IMÓVEIS
          </span>
          <span className="text-[9px] font-mono tracking-[0.25em] text-blue-400 uppercase block mt-1">
            & Lançamentos
          </span>
        </div>
      </div>

      {/* Action navigation */}
      <div className="flex items-center gap-4">
        <a 
          href="tel:+55115996488294" 
          className="hidden sm:flex items-center gap-1.5 text-xs text-slate-300 hover:text-white transition-colors"
        >
          <PhoneCall className="w-3.5 h-3.5 text-blue-400" />
          <span className="font-mono">15996488294</span>
        </a>

        <button
          onClick={onRegisterClick}
          className="bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-medium py-2 px-4 rounded-lg backdrop-blur-md transition-all active:translate-y-[1px] flex items-center gap-1.5 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
          <span>Falar com Especialista</span>
        </button>
      </div>
    </header>
  );
}
