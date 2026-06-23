import React from 'react';
import { motion } from 'framer-motion';
import { TowerData } from '../types';
import { Layers, Maximize2, Compass, ShieldCheck, X } from 'lucide-react';

interface TowerInfoProps {
  tower: TowerData;
  onClose: () => void;
  onRegisterInterest: () => void;
}

export default function TowerInfo({ tower, onClose, onRegisterInterest }: TowerInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="bg-slate-900/90 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 shadow-2xl w-full max-w-sm relative"
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
        aria-label="Fechar"
      >
        <X className="w-5 h-5" />
      </button>

      {/* Header */}
      <div className="mb-4">
        <span className="text-[10px] font-mono text-blue-400 tracking-wider uppercase block mb-1">
          Destaque do Projeto
        </span>
        <h3 className="text-2xl font-serif text-white tracking-tight">
          {tower.name}
        </h3>
        <p className="text-yellow-400 text-xs font-mono font-medium mt-1 uppercase tracking-wider">
          {tower.highlight}
        </p>
      </div>

      <p className="text-slate-300 text-sm leading-relaxed mb-5">
        {tower.description}
      </p>

      {/* Specs Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Pavimentos</span>
          </div>
          <span className="text-lg font-serif font-semibold text-white">
            {tower.floors} andares
          </span>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Maximize2 className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Altura Estimada</span>
          </div>
          <span className="text-lg font-serif font-semibold text-white">
            {tower.height}
          </span>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <Compass className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Orientação</span>
          </div>
          <span className="text-sm font-medium text-white">
            Face Norte / Parque
          </span>
        </div>

        <div className="bg-slate-950/40 p-3 rounded-lg border border-slate-800/60">
          <div className="flex items-center gap-1.5 text-slate-500 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-wider">Status lona</span>
          </div>
          <span className="text-xs font-semibold text-blue-300 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse inline-block" />
            Proteção Ativa
          </span>
        </div>
      </div>

      {/* Blueprints preview */}
      <div className="border border-dashed border-slate-800 rounded-xl p-3 bg-slate-950/60 text-center mb-6 group cursor-pointer">
        <span className="text-[11px] font-mono text-slate-500 group-hover:text-blue-400 transition-colors uppercase tracking-wider block mb-1">
          Visualizar Plantas Técnicas
        </span>
        <span className="text-[10px] text-slate-600 block">
          Disponível apenas para cadastros autorizados
        </span>
      </div>

      <button
        onClick={onRegisterInterest}
        className="w-full bg-blue-600 hover:bg-blue-500 active:translate-y-[1px] text-white text-xs font-semibold py-3 px-4 rounded-xl transition-all shadow-md hover:shadow-blue-500/10 flex items-center justify-center gap-2 cursor-pointer"
      >
        <span>Solicitar Informações da {tower.name}</span>
      </button>
    </motion.div>
  );
}
