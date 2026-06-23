import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Users, Phone, Mail, User, ShieldCheck, X } from 'lucide-react';
import { RegistrationData } from '../types';

interface RegisterFormProps {
  onSuccess: (lead: RegistrationData) => void;
  onClose?: () => void;
}

export default function RegisterForm({ onSuccess, onClose }: RegisterFormProps) {
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
    role: 'buyer',
    acceptedTerms: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [recentLeadsCount, setRecentLeadsCount] = useState(0);

  // Format phone number dynamically: (XX) XXXXX-XXXX
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 7) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhone(e.target.value);
    setFormData(prev => ({ ...prev, phone: formatted }));
    if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
  };

  const validate = () => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};
    if (!formData.name.trim()) newErrors.name = 'Nome completo é obrigatório';
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'E-mail é obrigatório';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    const phoneDigits = formData.phone.replace(/\D/g, '');
    if (!formData.phone.trim()) {
      newErrors.phone = 'Telefone/WhatsApp é obrigatório';
    } else if (phoneDigits.length < 10 || phoneDigits.length > 11) {
      newErrors.phone = 'Telefone deve ter 10 ou 11 dígitos';
    }

    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = 'Você deve aceitar os termos de privacidade';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Safe localStorage helper to prevent crashes in sandboxed cross-origin iframes
  const getLeadsFromStorage = (): any[] => {
    try {
      return JSON.parse(localStorage.getItem('teaser_leads') || '[]');
    } catch (e) {
      return [];
    }
  };

  const saveLeadsToStorage = (leads: any[]): void => {
    try {
      localStorage.setItem('teaser_leads', JSON.stringify(leads));
    } catch (e) {
      // Safe fallback
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // Save to local storage
      const existingLeads = getLeadsFromStorage();
      const newLead = {
        ...formData,
        id: typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function' 
          ? crypto.randomUUID() 
          : 'lead-' + Math.random().toString(36).substring(2, 15) + '-' + Date.now(),
        timestamp: new Date().toISOString(),
      };
      existingLeads.push(newLead);
      saveLeadsToStorage(existingLeads);
      
      setIsSubmitted(true);
      onSuccess(formData);
    }
  };

  useEffect(() => {
    const existingLeads = getLeadsFromStorage();
    setRecentLeadsCount(existingLeads.length);
  }, [isSubmitted]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-xl border border-blue-500/20 rounded-2xl p-6 sm:p-8 shadow-2xl max-w-md w-full relative overflow-hidden">
      {/* Absolute ambient light */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/5 rounded-full blur-2xl pointer-events-none" />

      {onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors cursor-pointer"
          aria-label="Fechar"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <AnimatePresence mode="wait">
        {!isSubmitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <span className="text-xs font-mono text-blue-400 tracking-wider uppercase block mb-1">
                Acesso Exclusivo
              </span>
              <h3 className="text-xl font-serif text-white tracking-tight">
                Receba o Book Digital Completo
              </h3>
              <p className="text-slate-400 text-sm mt-1">
                Seja um dos primeiros a conhecer as plantas e condições exclusivas de pré-lançamento.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Seu Nome
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: undefined }));
                    }}
                    placeholder="Nome completo"
                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Seu E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, email: e.target.value }));
                      if (errors.email) setErrors(prev => ({ ...prev, email: undefined }));
                    }}
                    placeholder="email@exemplo.com"
                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  WhatsApp / Celular
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={handlePhoneChange}
                    placeholder="(11) 99999-9999"
                    className="w-full bg-slate-950/60 border border-slate-700/50 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 transition-all"
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
                )}
              </div>

              {/* Profile Role */}
              <div>
                <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
                  Qual o seu perfil?
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['buyer', 'broker', 'investor'] as const).map(roleOption => {
                    const label = {
                      buyer: 'Comprador',
                      broker: 'Corretor',
                      investor: 'Investidor',
                    }[roleOption];

                    return (
                      <button
                        key={roleOption}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, role: roleOption }))}
                        className={`py-2 px-1 text-xs rounded-lg border text-center transition-all cursor-pointer font-medium ${
                          formData.role === roleOption
                            ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                            : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-300'
                        }`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Terms accepted */}
              <div className="pt-1">
                <label className="flex items-start gap-2.5 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={e => {
                      setFormData(prev => ({ ...prev, acceptedTerms: e.target.checked }));
                      if (errors.acceptedTerms) setErrors(prev => ({ ...prev, acceptedTerms: undefined }));
                    }}
                    className="mt-0.5 rounded border-slate-800 bg-slate-950 text-blue-600 focus:ring-offset-slate-900 cursor-pointer"
                  />
                  <span className="text-xs text-slate-400 group-hover:text-slate-300 transition-colors select-none">
                    Aceito receber contatos sobre este e outros lançamentos de alto padrão de acordo com as políticas de privacidade.
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p className="text-red-400 text-xs mt-1">{errors.acceptedTerms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 active:translate-y-[1px] text-white font-medium text-sm py-3 px-4 rounded-lg shadow-lg hover:shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Solicitar Book Digital</span>
                <Send className="w-4 h-4" />
              </button>
            </form>

            {recentLeadsCount > 0 && (
              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-500/60" />
                  <span>{recentLeadsCount} pessoas já cadastradas</span>
                </div>
                <span className="font-mono text-[10px] text-yellow-500/60">● Vagas VIP limitadas</span>
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 mb-4 animate-bounce">
              <CheckCircle className="w-8 h-8" />
            </div>
            
            <h3 className="text-xl font-serif text-white mb-2">
              Inscrição Confirmada!
            </h3>
            
            <p className="text-slate-300 text-sm max-w-sm mx-auto mb-6">
              Olá, <strong className="text-blue-300">{formData.name.split(' ')[0]}</strong>! Seu interesse foi registrado com sucesso. 
              Enviaremos o book digital e as plantas exclusivas diretamente para o seu WhatsApp{' '}
              <span className="text-blue-300 font-mono">{formData.phone}</span> em instantes.
            </p>

            <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 text-left space-y-2 mb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <ShieldCheck className="w-4 h-4 text-green-400 shrink-0" />
                <span>Atendimento prioritário habilitado</span>
              </div>
              <div className="text-xs text-slate-500 leading-relaxed">
                Um de nossos consultores de alto padrão entrará em contato para agendar uma apresentação virtual ou física com exclusividade.
              </div>
            </div>

            <button
              onClick={() => setIsSubmitted(false)}
              className="text-xs text-slate-400 hover:text-white underline transition-colors cursor-pointer"
            >
              Registrar outro e-mail
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
