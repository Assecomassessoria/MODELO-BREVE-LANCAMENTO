import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wind, 
  Fan, 
  Sparkles, 
  HelpCircle, 
  PhoneCall, 
  MapPin, 
  CheckCircle, 
  Layers, 
  Send,
  Volume2,
  VolumeX,
  Gauge,
  Sliders,
  Building,
  ArrowRight,
  Info,
  Sun,
  CloudFog,
  CloudRain,
  Zap,
  Clock,
  Play,
  Pause,
  Palette
} from 'lucide-react';
import Header from './components/Header';
import Spotlights from './components/Spotlights';
import RegisterForm from './components/RegisterForm';
import TowerInfo from './components/TowerInfo';
import { WindSettings, TowerData, RegistrationData } from './types';

// Concrete tower specifications
const TOWERS_DATA: TowerData[] = [
  {
    id: 'tower-left',
    name: 'Torre (Oeste)',
    height: '46m',
    floors: 11,
    highlight: 'Residências Sky Garden',
    description: 'Focada em design biofílico com amplos terraços arborizados e pé-direito duplo nas áreas sociais. Um sofisticado projeto de 11 pavimentos integrado à natureza.',
    widthClass: 'w-[90px] min-[390px]:w-[110px] sm:w-[190px]',
    heightClass: 'h-[230px] min-[390px]:h-[285px] sm:h-[420px]',
    alignClass: 'items-start',
    shadowClass: 'shadow-blue-900/10',
    bgGradient: 'from-blue-600/90 via-blue-800 to-indigo-950',
  },
  {
    id: 'tower-center',
    name: 'Torre (Centro)',
    height: '44m',
    floors: 11,
    highlight: 'The Penthouse Collection',
    description: 'A imponente torre central do empreendimento com 11 pavimentos exclusivos de altíssimo padrão, abrigando coberturas lineares de tirar o fôlego e lazer privativo.',
    widthClass: 'w-[115px] min-[390px]:w-[140px] sm:w-[240px]',
    heightClass: 'h-[295px] min-[390px]:h-[365px] sm:h-[540px]',
    alignClass: 'items-center z-10',
    shadowClass: 'shadow-blue-500/20',
    bgGradient: 'from-blue-500 via-blue-700 to-slate-950',
  },
  {
    id: 'tower-right',
    name: 'Torre (Leste)',
    height: '46m',
    floors: 11,
    highlight: 'Residências Ateliê',
    description: 'Design contemporâneo com fachada termoacústica de alta tecnologia com 11 andares, protegida temporariamente pela emblemática lona azul de alta durabilidade.',
    widthClass: 'w-[100px] min-[390px]:w-[120px] sm:w-[200px]',
    heightClass: 'h-[260px] min-[390px]:h-[320px] sm:h-[470px]',
    alignClass: 'items-end',
    shadowClass: 'shadow-blue-900/10',
    bgGradient: 'from-blue-700/90 via-blue-900 to-slate-900',
  }
];

// Helper to render weather icons dynamically
const WeatherIcon = ({ iconName, className }: { iconName: string; className?: string }) => {
  switch (iconName) {
    case 'Sun': return <Sun className={className} />;
    case 'CloudFog': return <CloudFog className={className} />;
    case 'Wind': return <Wind className={className} />;
    case 'CloudRain': return <CloudRain className={className} />;
    case 'Zap': return <Zap className={className} />;
    default: return <Sun className={className} />;
  }
};

const UPCOMING_WEATHER_EVENTS = [
  {
    id: 'event-1',
    time: '10:30',
    name: 'Brisa Suave',
    icon: 'Sun',
    description: 'Vento leve de 15km/h, céu limpo, visibilidade total do canteiro.',
    settings: { intensity: 15, speed: 0.5, fog: 0.0, label: 'Ensolarado & Brisa' }
  },
  {
    id: 'event-2',
    time: '11:15',
    name: 'Neblina do Horto',
    icon: 'CloudFog',
    description: 'Névoa densa típica do Horto cobrindo as torres à meia-altura.',
    settings: { intensity: 22, speed: 0.7, fog: 0.65, label: 'Névoa / Visibilidade Reduzida' }
  },
  {
    id: 'event-3',
    time: '12:00',
    name: 'Vento Leste',
    icon: 'Wind',
    description: 'Deslocamento de massas de ar com rajadas de até 35km/h balançando as lonas.',
    settings: { intensity: 45, speed: 1.4, fog: 0.15, label: 'Rajadas Moderadas' }
  },
  {
    id: 'event-4',
    time: '12:45',
    name: 'Chuva Passageira',
    icon: 'CloudRain',
    description: 'Precipitação fraca com umidade elevada e oscilação térmica.',
    settings: { intensity: 55, speed: 1.8, fog: 0.4, label: 'Precipitação Leve' }
  },
  {
    id: 'event-5',
    time: '13:30',
    name: 'Tempestade Isolada',
    icon: 'Zap',
    description: 'Alerta climático de ventos fortes de até 70km/h com descargas atmosféricas.',
    settings: { intensity: 80, speed: 2.7, fog: 0.25, label: 'Alerta de Temporal' }
  }
];

export default function App() {
  // State variables
  const [selectedTower, setSelectedTower] = useState<TowerData | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [spotlightsEnabled, setSpotlightsEnabled] = useState(true);
  const [windSound, setWindSound] = useState(false);
  const [lightningActive, setLightningActive] = useState(false);
  const [systemNotification, setSystemNotification] = useState<string | null>(null);
  const [fogDensity, setFogDensity] = useState(0.0);
  const [selectedEventId, setSelectedEventId] = useState('event-1');
  const [isAutoPlayWeather, setIsAutoPlayWeather] = useState(true);
  const [buildingColorTheme, setBuildingColorTheme] = useState<'blue' | 'sunny'>('blue');
  
  // Interactive Wind State
  const [windSettings, setWindSettings] = useState<WindSettings>({
    intensity: 15, // matches Event 1 (Brisa Suave) initial
    speed: 0.5,    
  });

  // Keep windSettings in ref for requestAnimationFrame high-performance loop
  const windSettingsRef = useRef<WindSettings>(windSettings);
  useEffect(() => {
    windSettingsRef.current = windSettings;
  }, [windSettings]);

  // SVG feTurbulence ref for animation manipulation
  const turbulenceRef = useRef<SVGFETurbulenceElement>(null);
  const displacementMapRef = useRef<SVGFEDisplacementMapElement>(null);

  // High performance animation loop using direct DOM attributes to avoid React overhead (60 FPS)
  useEffect(() => {
    let t = 0;
    let animationFrameId: number;

    const animateWind = () => {
      const settings = windSettingsRef.current;
      if (!settings) {
        animationFrameId = requestAnimationFrame(animateWind);
        return;
      }
      // Increment time based on wind speed
      t += 0.008 * (settings.speed ?? 1.2);

      // Calculate dynamic noise frequencies mimicking natural wind gusts
      // Base frequency X moves slower, Y moves faster to represent vertical tension and horizontal flapping
      const baseFreqX = 0.008 + Math.sin(t) * 0.0025;
      const baseFreqY = 0.045 + Math.cos(t * 1.6) * 0.012;

      if (turbulenceRef.current) {
        try {
          turbulenceRef.current.setAttribute('baseFrequency', `${baseFreqX} ${baseFreqY}`);
        } catch (e) {
          // Guard against element state changes during unmount
        }
      }

      if (displacementMapRef.current) {
        try {
          // Subtle fluctuation in scale for natural gusts
          const gustMultiplier = 1 + Math.sin(t * 2.3) * 0.15;
          displacementMapRef.current.setAttribute('scale', ((settings.intensity ?? 35) * gustMultiplier).toString());
        } catch (e) {
          // Guard against element state changes during unmount
        }
      }

      animationFrameId = requestAnimationFrame(animateWind);
    };

    animationFrameId = requestAnimationFrame(animateWind);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Automated weather timeline rotation
  useEffect(() => {
    if (!isAutoPlayWeather) return;

    const interval = setInterval(() => {
      setSelectedEventId(currentId => {
        const currentIndex = UPCOMING_WEATHER_EVENTS.findIndex(e => e.id === currentId);
        const nextIndex = (currentIndex + 1) % UPCOMING_WEATHER_EVENTS.length;
        const nextEvent = UPCOMING_WEATHER_EVENTS[nextIndex];
        
        setWindSettings({
          intensity: nextEvent.settings.intensity,
          speed: nextEvent.settings.speed
        });
        setFogDensity(nextEvent.settings.fog);

        if (nextEvent.id === 'event-5') {
          setLightningActive(true);
          setTimeout(() => setLightningActive(false), 200);
        }

        setSystemNotification(`Evolução do Clima: Transição automática para "${nextEvent.name}"`);
        setTimeout(() => setSystemNotification(null), 4000);

        return nextEvent.id;
      });
    }, 25000); // Transitions every 25 seconds

    return () => clearInterval(interval);
  }, [isAutoPlayWeather]);

  // Click handler for weather event selection
  const handleSelectWeatherEvent = (id: string) => {
    const event = UPCOMING_WEATHER_EVENTS.find(e => e.id === id);
    if (!event) return;

    setSelectedEventId(id);
    setIsAutoPlayWeather(false); // pause auto-rotation on user manual interaction
    setWindSettings({
      intensity: event.settings.intensity,
      speed: event.settings.speed
    });
    setFogDensity(event.settings.fog);

    if (id === 'event-5') {
      setLightningActive(true);
      const timer1 = setTimeout(() => setLightningActive(false), 200);
      const timer2 = setTimeout(() => {
        setLightningActive(true);
        setTimeout(() => setLightningActive(false), 150);
      }, 400);
    }

    setSystemNotification(`Simulação: Clima alterado para "${event.name}"`);
    setTimeout(() => setSystemNotification(null), 4000);
  };

  // Trigger storm mode simulation preset
  const handleStormPreset = () => {
    setSelectedEventId('event-5');
    setIsAutoPlayWeather(false);
    setFogDensity(0.25);
    setWindSettings({ intensity: 80, speed: 2.7 });
    setSystemNotification("Alerta Climático: Ventos de até 80km/h simulados no canteiro!");
    
    // Simulate brief structural lighting flashes
    setLightningActive(true);
    const timer1 = setTimeout(() => setLightningActive(false), 200);
    const timer2 = setTimeout(() => {
      setLightningActive(true);
      setTimeout(() => setLightningActive(false), 150);
    }, 400);

    setTimeout(() => {
      setSystemNotification(null);
    }, 4000);
  };

  // Reset wind to gentle breeze
  const handleBreezePreset = () => {
    setSelectedEventId('event-1');
    setIsAutoPlayWeather(false);
    setFogDensity(0.0);
    setWindSettings({ intensity: 15, speed: 0.5 });
    setSystemNotification("Clima Estabilizado: Brisa marítima suave ativada.");
    setTimeout(() => setSystemNotification(null), 3000);
  };

  const handleRegisterSuccess = (lead: RegistrationData) => {
    setSystemNotification(`Obrigado, ${lead.name}! Seu cadastro foi realizado com sucesso.`);
    setTimeout(() => {
      setSystemNotification(null);
      setShowRegister(false);
    }, 5000);
  };

  return (
    <div className={`relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-blue-950 flex flex-col justify-between overflow-hidden font-sans transition-colors duration-1000 ${lightningActive ? 'brightness-150 saturate-150' : ''}`}>
      
      {/* Background stars or construction particles */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white/40 rounded-full animate-pulse" />
        <div className="absolute top-24 right-32 w-1.5 h-1.5 bg-blue-400/30 rounded-full animate-pulse" />
        <div className="absolute top-48 left-1/3 w-1 h-1 bg-white/30 rounded-full" />
        <div className="absolute top-16 right-1/4 w-1 h-1 bg-yellow-400/20 rounded-full animate-pulse" />
        <div className="absolute top-80 right-12 w-1.5 h-1.5 bg-blue-300/40 rounded-full animate-pulse" />
        
        {/* Floating dust particles near construction site */}
        <div className="particle absolute bottom-24 left-[20%] w-1.5 h-1.5 bg-blue-400/20 rounded-full" style={{ animationDelay: '0s' }} />
        <div className="particle absolute bottom-32 left-[45%] w-1 h-1 bg-white/30 rounded-full" style={{ animationDelay: '2s' }} />
        <div className="particle absolute bottom-16 left-[70%] w-2 h-2 bg-blue-300/10 rounded-full" style={{ animationDelay: '4s' }} />
      </div>

      {/* Interactive Searchlight Beams in Background */}
      <Spotlights enabled={spotlightsEnabled} intensity={0.7} />

      {/* Dynamic Fog Overlay Layers */}
      <AnimatePresence>
        {fogDensity > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: fogDensity }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2 }}
            className="absolute inset-0 pointer-events-none z-15 select-none overflow-hidden"
          >
            {/* Drifting Fog Layer 1 */}
            <div className="absolute bottom-[-10%] -left-[10%] w-[120%] h-[70%] bg-gradient-to-t from-slate-900/40 via-slate-100/10 to-transparent mix-blend-lighten pointer-events-none" />
            
            {/* Fuzzy Drift clouds */}
            <div className="absolute bottom-[10%] -left-[20%] w-[80%] h-[45%] bg-slate-400/15 rounded-full filter blur-[70px] animate-fog-slow" />
            <div className="absolute bottom-[25%] -right-[20%] w-[75%] h-[50%] bg-blue-300/15 rounded-full filter blur-[90px] animate-fog-medium" />
            
            {/* Third lower ground fog layer */}
            <div className="absolute bottom-[-5%] left-[10%] w-[90%] h-[30%] bg-slate-300/20 rounded-full filter blur-[60px] animate-fog-slow" style={{ animationDelay: '-5s' }} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* SVG Filters for Dynamic wind warping on lona */}
      <svg className="absolute w-0 h-0 select-none pointer-events-none" aria-hidden="true">
        <defs>
          <filter id="onda-lona" x="-20%" y="-20%" width="140%" height="140%">
            {/* 
              feTurbulence generates fractal noise that acts as our wind vector.
              baseFrequency values represent how compressed the folds are.
              numOctaves defines detailed fabric micro-folds.
            */}
            <feTurbulence 
              ref={turbulenceRef}
              type="fractalNoise" 
              baseFrequency="0.01 0.05" 
              numOctaves="3" 
              result="noise" 
            />
            {/* 
              feDisplacementMap warps our input pixels (the tarp graphics) 
              along the vector channel specified by the turbulence noise.
            */}
            <feDisplacementMap 
              ref={displacementMapRef}
              in="SourceGraphic" 
              in2="noise" 
              scale="35" 
              xChannelSelector="R" 
              yChannelSelector="G" 
            />
          </filter>
        </defs>
      </svg>

      {/* Header */}
      <Header onRegisterClick={() => setShowRegister(true)} />

      {/* Notification Toast */}
      <AnimatePresence>
        {systemNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="absolute top-20 left-1/2 -translate-x-1/2 z-50 bg-blue-600/90 backdrop-blur-md text-white text-xs font-mono px-4 py-2 rounded-full border border-blue-400/30 flex items-center gap-2 shadow-lg shadow-blue-500/20"
          >
            <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
            <span>{systemNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MAIN CONTAINER */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-12 pt-20 sm:pt-28 pb-4 flex flex-col justify-between z-10">
        
        {/* UPPER HERO GRID (Branding + Teaser Text) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start relative z-10">
          <div className="lg:col-span-7 flex flex-col text-left">
            <span className="text-blue-400 text-[10px] sm:text-sm font-mono tracking-[0.25em] sm:tracking-[0.3em] uppercase mb-1.5 sm:mb-3 block">
              ✦ SOROCABA / HORTO
            </span>
            
            <h1 className="text-2xl xs:text-3xl sm:text-5xl lg:text-6xl font-serif text-white tracking-tight leading-tight mb-3 glow-text-blue select-none">
              Breve Lançamento
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-base max-w-lg mb-4 sm:mb-6 leading-relaxed">
              Três torres monumentais cobertas sob o mistério da icônica lona azul. 
              Um marco de engenharia e sofisticação no coração do bairro mais prestigiado. 
              O novo horizonte está sendo tecido.
            </p>

            <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 w-full sm:w-auto">
              <button
                onClick={() => setShowRegister(true)}
                className="bg-blue-600 hover:bg-blue-500 active:translate-y-[1px] text-white text-[11px] sm:text-xs font-semibold uppercase tracking-wider py-2.5 sm:py-3.5 px-5 sm:px-6 rounded-lg transition-all shadow-md shadow-blue-600/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Cadastre-se para o Pré-Lançamento</span>
                <ArrowRight className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-white" />
              </button>

              <div className="flex items-center justify-center sm:justify-start gap-2 text-[10px] sm:text-xs font-mono text-slate-400 bg-slate-950/40 py-2 sm:py-2.5 px-3.5 sm:px-4 rounded-lg border border-slate-800/60 backdrop-blur-sm">
                <MapPin className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-blue-500 shrink-0" />
                <span>Alameda do Horto, 714, Horto</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 flex flex-col items-stretch sm:items-start lg:items-end justify-start gap-4">
            {/* Interactive Stats Panel */}
            <div className="bg-slate-950/50 backdrop-blur-md border border-slate-800 p-3.5 rounded-xl max-w-xs w-full mx-auto sm:mx-0 text-left font-mono">
              <span className="text-[9px] text-slate-500 tracking-wider block uppercase mb-1.5">Monitoramento do Canteiro</span>
              <div className="space-y-2 text-[11px] sm:text-xs text-slate-300">
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span>Velocidade Vento:</span>
                  <span className="text-blue-400 font-bold">{(windSettings.speed * 25).toFixed(0)} km/h</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span>Tensão da Lona:</span>
                  <span className="text-blue-400 font-bold">{(windSettings.intensity * 1.4).toFixed(0)} N/m</span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1">
                  <span>Iluminação:</span>
                  <span className={spotlightsEnabled ? "text-green-400 font-bold" : "text-yellow-500 font-bold"}>
                    {spotlightsEnabled ? "HOLOFOTES ATIVOS" : "ESTÁTICA"}
                  </span>
                </div>
                <div className="flex justify-between border-b border-slate-900 pb-1 items-center">
                  <span>Cor da Lona:</span>
                  <button 
                    onClick={() => {
                      const next = buildingColorTheme === 'blue' ? 'sunny' : 'blue';
                      setBuildingColorTheme(next);
                      setSystemNotification(`Visualização alterada para: ${next === 'blue' ? 'Lona Azul Clássica' : 'Lona Ensolarada Dia'}`);
                      setTimeout(() => setSystemNotification(null), 4000);
                    }}
                    className={`px-2 py-0.5 rounded text-[9px] font-bold border transition-all cursor-pointer ${
                      buildingColorTheme === 'blue'
                        ? 'bg-blue-600/20 text-blue-300 border-blue-500/35 hover:bg-blue-600/30'
                        : 'bg-amber-600/20 text-amber-300 border-amber-500/35 hover:bg-amber-600/30'
                    }`}
                  >
                    {buildingColorTheme === 'blue' ? '🔵 AZUL' : '☀️ ENSOLARADO'}
                  </button>
                </div>
                <div className="flex items-center justify-between pt-0.5">
                  <span>Interativo:</span>
                  <span className="text-[9px] text-slate-500 flex items-center gap-0.5">
                    <Info className="w-2.5 h-2.5 text-slate-400" /> Toque nas torres
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SCENARIO OF THE 3 TOWERS COB_LONA */}
        <div className="flex-1 w-full min-h-[40vh] sm:min-h-[50vh] flex items-end justify-center relative mt-6 mb-2">
          
          {/* Ground Base platform */}
          <div className="absolute bottom-0 left-0 w-full h-8 bg-gradient-to-t from-slate-950 to-slate-900/90 border-t border-slate-800 z-20" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[95%] h-2 bg-blue-950/20 border-t border-blue-900/10 blur-sm z-10" />

          {/* Construction scaffold structures in background (decorative lines) */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-4xl h-[420px] pointer-events-none opacity-20 z-0 border-b border-dashed border-slate-700/40">
            <svg width="100%" height="100%" className="w-full h-full text-slate-500">
              <line x1="5%" y1="100%" x2="5%" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="33%" y1="100%" x2="33%" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="66%" y1="100%" x2="66%" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              <line x1="95%" y1="100%" x2="95%" y2="0" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
              
              {/* Giant construction crane silhouette on the right background */}
              <path d="M 750,200 L 750,420 M 750,230 L 950,150 M 750,230 L 650,230" stroke="currentColor" strokeWidth="1.5" strokeDasharray="none" opacity="0.4" />
              <line x1="750" y1="230" x2="950" y2="230" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
            </svg>
          </div>

          {/* Core Arena for Towers */}
          <div className="relative flex items-end justify-center gap-2 sm:gap-10 md:gap-14 w-full max-w-4xl h-full pb-8 z-10">
            
            {TOWERS_DATA.map((tower, idx) => {
              const isSelected = selectedTower?.id === tower.id;
              
              return (
                <div 
                  key={tower.id}
                  onClick={() => setSelectedTower(tower)}
                  className={`relative flex flex-col ${tower.alignClass} group cursor-pointer`}
                >
                  {/* Blinking Red Safety Beacon Warning light at the absolute top of the structure */}
                  <div className="absolute top-[-3px] left-1/2 -translate-x-1/2 z-20 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 sm:w-2.5 sm:h-2.5 bg-red-600 rounded-full animate-beacon shadow-lg shadow-red-500" />
                  </div>

                  {/* Reinforcement Steel Rebar / Structural Columns on top, giving shape of an active construction building with smooth growth animation */}
                  <motion.div 
                    initial={{ scaleY: 0.3 }}
                    animate={{ scaleY: spotlightsEnabled ? 1 : 0.3 }}
                    transition={{ 
                      duration: 1.8, 
                      ease: [0.16, 1, 0.3, 1], // Custom snappy exponential easeOut curve
                      delay: idx * 0.12 // Staggered entrance for organic progression look
                    }}
                    style={{ originY: 1 }}
                    className="absolute top-[-14px] sm:top-[-24px] inset-x-0 h-[14px] sm:h-[24px] flex justify-around px-2 sm:px-6 pointer-events-none z-0"
                  >
                    <div className="w-[2px] sm:w-[4px] h-full bg-slate-700/80 rounded-t relative">
                      <span className="absolute top-[-4px] sm:top-[-8px] left-[0.5px] sm:left-[1px] w-[0.5px] sm:w-[1px] h-[4px] sm:h-[8px] bg-amber-600/70" />
                      <span className="absolute top-[-6px] sm:top-[-10px] left-[1px] sm:left-[3px] w-[0.5px] sm:w-[1px] h-[6px] sm:h-[10px] bg-amber-600/70" />
                    </div>
                    <div className="w-[2px] sm:w-[4px] h-full bg-slate-700/80 rounded-t relative">
                      <span className="absolute top-[-5px] sm:top-[-9px] left-[0.5px] sm:left-[1px] w-[0.5px] sm:w-[1px] h-[5px] sm:h-[9px] bg-amber-600/70" />
                      <span className="absolute top-[-7px] sm:top-[-11px] left-[1px] sm:left-[3px] w-[0.5px] sm:w-[1px] h-[7px] sm:h-[11px] bg-amber-600/70" />
                    </div>
                    <div className="w-[2px] sm:w-[4px] h-full bg-slate-700/80 rounded-t relative">
                      <span className="absolute top-[-3px] sm:top-[-7px] left-[0.5px] sm:left-[1px] w-[0.5px] sm:w-[1px] h-[3px] sm:h-[7px] bg-amber-600/70" />
                      <span className="absolute top-[-5px] sm:top-[-9px] left-[1px] sm:left-[3px] w-[0.5px] sm:w-[1px] h-[5px] sm:h-[9px] bg-amber-600/70" />
                    </div>
                  </motion.div>

                  {/* Steel cable ropes stretching diagonally to ground - visual representation */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none select-none z-10 opacity-30">
                    <line 
                      x1="0" y1="0" x2="30" y2="100%" 
                      stroke="#94a3b8" strokeWidth="1.5" 
                    />
                    <line 
                      x1="100%" y1="0" x2="100%" y2="100%" 
                      stroke="#94a3b8" strokeWidth="1" 
                    />
                  </svg>

                  {/* The Swaying Blue Tarp Outer element (filtered with svg turbulence) */}
                  <div 
                    className={`relative ${tower.widthClass} ${tower.heightClass} transition-all duration-300 rounded-t-lg sm:rounded-t-xl overflow-hidden`}
                    style={{
                      // Core wave filter applied
                      filter: 'url(#onda-lona)',
                      transformOrigin: 'bottom center',
                    }}
                  >
                    {/* Blue or Sunny fabric surface with crease overlays */}
                    <div 
                      className={`absolute inset-0 bg-gradient-to-br ${
                        buildingColorTheme === 'sunny'
                          ? tower.id === 'tower-left'
                            ? 'from-amber-400 via-orange-500 to-amber-950'
                            : tower.id === 'tower-center'
                            ? 'from-yellow-400 via-amber-500 to-stone-900'
                            : 'from-orange-400 via-amber-600 to-amber-950'
                          : tower.bgGradient
                      } border-t border-l border-white/20 shadow-2xl flex flex-col justify-between p-2 sm:p-4`}
                    >
                      {/* Sub-scaffolding grid shining through slightly */}
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,_transparent_1px),_linear-gradient(90deg,_rgba(255,255,255,0.03)_1px,_transparent_1px)] bg-[size:14px_14px] pointer-events-none opacity-60" />

                      {/* 11 REAL floors structures (Slabs & Columns) to "Dar forma de Prédio" (Give building shape) */}
                      <div className="absolute inset-0 flex flex-col justify-between pointer-events-none py-1 sm:py-1.5 opacity-60">
                        {Array.from({ length: 11 }).map((_, i) => (
                          <div 
                            key={i} 
                            className="w-full flex-1 border-b border-black/30 relative flex items-center justify-around"
                          >
                            {/* Horizontal concrete slab line */}
                            <div className="absolute bottom-0 inset-x-0 h-[1px] sm:h-[2px] bg-white/5" />
                            
                            {/* Columns dividing apartments/office bays */}
                            <div className="w-[1.5px] sm:w-[3px] h-full bg-black/25" />
                            <div className="w-[1.5px] sm:w-[3px] h-full bg-black/25" />
                            <div className="w-[1.5px] sm:w-[3px] h-full bg-black/25" />
                            <div className="w-[1.5px] sm:w-[3px] h-full bg-black/25" />

                            {/* Windows of each apartment/office floor showing through blue tarp */}
                            <div className="absolute inset-0 flex justify-around items-center px-1.5 sm:px-4">
                              <span className={`w-1.5 min-[390px]:w-2 sm:w-3.5 h-2.5 min-[390px]:h-3 sm:h-4 rounded-sm border border-black/25 transition-all duration-1000 ${
                                i === 10 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' : 
                                i === 8 && idx === 1 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                i === 5 && idx === 0 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                i === 2 && idx === 2 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                'bg-black/15'
                              }`} />
                              <span className={`w-1.5 min-[390px]:w-2 sm:w-3.5 h-2.5 min-[390px]:h-3 sm:h-4 rounded-sm border border-black/25 transition-all duration-1000 ${
                                i === 10 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                i === 7 && idx === 2 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                i === 4 && idx === 1 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                'bg-black/15'
                              }`} />
                              <span className={`w-1.5 min-[390px]:w-2 sm:w-3.5 h-2.5 min-[390px]:h-3 sm:h-4 rounded-sm border border-black/25 transition-all duration-1000 ${
                                i === 10 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                i === 6 && idx === 0 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                i === 3 && idx === 2 ? 'bg-yellow-400/20 shadow-[0_0_8px_rgba(234,179,8,0.2)]' :
                                'bg-black/15'
                              }`} />
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Vertical shade shadows (folds of fabric) */}
                      <div className="absolute inset-y-0 left-[20%] w-[15%] bg-black/15 filter blur-[2px] pointer-events-none" />
                      <div className="absolute inset-y-0 left-[50%] w-[12%] bg-black/20 filter blur-[4px] pointer-events-none" />
                      <div className="absolute inset-y-0 left-[75%] w-[18%] bg-black/15 filter blur-[3px] pointer-events-none" />
                      
                      {/* Vertical high light creases */}
                      <div className="absolute inset-y-0 left-[35%] w-[3px] bg-white/10 filter blur-[1px] pointer-events-none" />
                      <div className="absolute inset-y-0 left-[68%] w-[2px] bg-white/10 filter blur-[1px] pointer-events-none" />

                      {/* Subtle rope anchors drawn onto the lona body */}
                      <div className="absolute bottom-0 inset-x-0 h-6 sm:h-10 bg-slate-950/40 border-t border-slate-900/60 flex justify-around items-center px-1 sm:px-2">
                        <span className="w-0.5 sm:w-1 h-2 sm:h-4 bg-slate-800 rounded-full" />
                        <span className="w-0.5 sm:w-1 h-2 sm:h-4 bg-slate-800 rounded-full" />
                        <span className="w-0.5 sm:w-1 h-2 sm:h-4 bg-slate-800 rounded-full" />
                        <span className="w-0.5 sm:w-1 h-2 sm:h-4 bg-slate-800 rounded-full" />
                      </div>

                      {/* Brand Monogram in watermark fashion inside the lona */}
                      <div className="mt-4 sm:mt-8 opacity-15 select-none font-serif text-center w-full flex-col items-center scale-75 min-[390px]:scale-90 sm:scale-100 hidden min-[350px]:flex">
                        <Building className="w-5 sm:w-8 h-5 sm:h-8 text-white mb-0.5 sm:mb-1" />
                        <span className="text-[7px] sm:text-[10px] tracking-[0.2em] font-mono text-white">VERTICE</span>
                      </div>

                      {/* Structural labels of the block */}
                      <div className="z-10 bg-slate-950/60 backdrop-blur-sm px-1.5 sm:px-2.5 py-0.5 sm:py-1.5 rounded border border-white/5 self-center mt-auto mb-2 sm:mb-8 pointer-events-none text-center">
                        <span className={`font-mono text-[7px] sm:text-[9px] ${buildingColorTheme === 'sunny' ? 'text-amber-300' : 'text-blue-300'} font-semibold uppercase tracking-wider block leading-none sm:leading-normal`}>
                          BLOCO 0{idx + 1}
                        </span>
                        <span className="text-[8px] sm:text-[10px] font-bold text-white block mt-0.5 sm:mt-0">
                          {tower.floors} ANDARES
                        </span>
                      </div>
                    </div>

                    {/* Edge shadow overlay */}
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,_rgba(0,0,0,0.3)_0%,_transparent_15%,_transparent_85%,_rgba(0,0,0,0.3)_100%)] pointer-events-none" />
                  </div>

                  {/* Active Selection Glow Ring (outside the waving filter so it stays crisp) */}
                  <div 
                    className={`absolute inset-0 -m-0.5 sm:-m-1 rounded-t-lg sm:rounded-t-2xl border sm:border-2 transition-all duration-300 pointer-events-none z-20 ${
                      isSelected 
                        ? 'border-yellow-400 opacity-100 shadow-[0_0_15px_rgba(234,179,8,0.4)]' 
                        : 'border-blue-500/0 group-hover:border-blue-500/30 opacity-100'
                    }`} 
                  />

                  {/* Tower Label card popping under the tower */}
                  <div className="mt-3 text-center transition-all duration-300 group-hover:translate-y-[-2px] select-none">
                    <span className="font-serif text-xs text-slate-300 block group-hover:text-white transition-colors">
                      {tower.name.split(' ')[1]} {/* Aurora, Zenith, Lumina */}
                    </span>
                    <span className="font-mono text-[10px] text-slate-500 block uppercase tracking-widest mt-0.5">
                      {tower.height} • {tower.floors} Pav.
                    </span>
                  </div>
                </div>
              );
            })}

          </div>
        </div>

        {/* WEATHER SIMULATOR TIMELINE PANEL */}
        <div className="relative z-20 w-full mb-3 sm:mb-4 bg-slate-950/60 backdrop-blur-md border border-slate-850 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl text-left">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-3 pb-2 border-b border-slate-900">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-400 animate-pulse" />
              <div>
                <h4 className="text-xs sm:text-sm font-semibold text-white tracking-wide">Cronograma de Simulação Climática</h4>
                <p className="text-[10px] text-slate-400">Previsões e eventos atmosféricos programados para o canteiro</p>
              </div>
            </div>
            {/* Play/Pause Autoplay Controls */}
            <button 
              onClick={() => setIsAutoPlayWeather(!isAutoPlayWeather)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] sm:text-[10px] font-mono font-medium transition-all cursor-pointer ${
                isAutoPlayWeather 
                  ? 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/20' 
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-400 border border-slate-800'
              }`}
            >
              {isAutoPlayWeather ? (
                <>
                  <Pause className="w-2.5 h-2.5 text-blue-400" />
                  <span>TRANSIÇÃO ATIVA (25s)</span>
                </>
              ) : (
                <>
                  <Play className="w-2.5 h-2.5 text-slate-400" />
                  <span>SIMULAÇÃO PAUSADA</span>
                </>
              )}
            </button>
          </div>

          {/* Timeline Track & Steps */}
          <div className="relative flex flex-col md:flex-row justify-between items-stretch md:items-center gap-2.5 md:gap-2 my-2 select-none">
            {/* Horizontal connection track line on desktop */}
            <div className="absolute left-6 right-6 top-1/2 -translate-y-1/2 h-[1px] bg-slate-800 pointer-events-none hidden md:block z-0" />
            
            {UPCOMING_WEATHER_EVENTS.map((event) => {
              const isActive = selectedEventId === event.id;
              return (
                <div 
                  key={event.id}
                  onClick={() => handleSelectWeatherEvent(event.id)}
                  className={`relative z-10 flex flex-row md:flex-col items-center gap-3 md:gap-2 flex-1 p-2 sm:p-2.5 md:p-1.5 rounded-lg border transition-all cursor-pointer text-left md:text-center ${
                    isActive 
                      ? 'bg-blue-950/45 border-blue-500/80 shadow-[0_0_12px_rgba(59,130,246,0.15)] text-white' 
                      : 'bg-slate-950/20 border-slate-900 text-slate-400 hover:bg-slate-900/45 hover:border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {/* Time Badge */}
                  <div className="flex flex-col items-start md:items-center min-w-[50px] md:min-w-0">
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-900 text-slate-500'
                    }`}>
                      {event.time}
                    </span>
                  </div>

                  {/* Weather Icon badge */}
                  <div className={`p-1.5 rounded-full transition-all ${
                    isActive ? 'bg-blue-500/20 text-blue-400 scale-110' : 'bg-slate-900 text-slate-500'
                  }`}>
                    <WeatherIcon iconName={event.icon} className="w-4 h-4" />
                  </div>

                  {/* Text details */}
                  <div className="flex-1 md:flex-none text-left md:text-center">
                    <span className={`text-xs font-semibold block leading-tight ${
                      isActive ? 'text-white' : 'text-slate-300'
                    }`}>
                      {event.name}
                    </span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase tracking-wider block">
                      {event.settings.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Current weather detail caption */}
          <div className="mt-3 bg-slate-950/40 border border-slate-900/60 rounded-lg p-2 px-3 text-[10px] sm:text-xs text-slate-400 font-mono flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-400 shrink-0" />
            <span className="leading-tight">
              {UPCOMING_WEATHER_EVENTS.find(e => e.id === selectedEventId)?.description}
            </span>
          </div>
        </div>

        {/* BOTTOM HUD SECTION (Controls, Actions, Toggles) */}
        <div className="relative z-20 grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 items-center bg-slate-950/70 backdrop-blur-lg border border-slate-800 p-3 sm:p-4 rounded-xl sm:rounded-2xl">
          
          {/* Controls Label */}
          <div className="md:col-span-3 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-blue-950/60 border border-blue-900/40 text-blue-400">
              <Sliders className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="text-left">
              <span className="text-[9px] sm:text-[10px] font-mono text-blue-400 tracking-wider uppercase block">Painel do Vento</span>
              <span className="text-[11px] sm:text-xs font-semibold text-white">Ajuste de Clima Realista</span>
            </div>
          </div>

          {/* Intensity Slider */}
          <div className="md:col-span-3 flex flex-col text-left">
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-slate-400 mb-1 px-1">
              <span>FORÇA DO VENTO</span>
              <span className="text-blue-400 font-bold">{windSettings.intensity}%</span>
            </div>
            <input 
              type="range" 
              min="5" 
              max="90" 
              value={windSettings.intensity} 
              onChange={(e) => setWindSettings(prev => ({ ...prev, intensity: parseInt(e.target.value) }))}
              className="w-full accent-blue-500 bg-slate-900 rounded-lg appearance-none h-1.5 sm:h-2 cursor-pointer border border-slate-800"
            />
          </div>

          {/* Speed Slider */}
          <div className="md:col-span-3 flex flex-col text-left">
            <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-mono text-slate-400 mb-1 px-1">
              <span>VELOCIDADE (RAJADA)</span>
              <span className="text-blue-400 font-bold">{(windSettings.speed * 20).toFixed(0)} km/h</span>
            </div>
            <input 
              type="range" 
              min="0.2" 
              max="3" 
              step="0.1" 
              value={windSettings.speed} 
              onChange={(e) => setWindSettings(prev => ({ ...prev, speed: parseFloat(e.target.value) }))}
              className="w-full accent-blue-500 bg-slate-900 rounded-lg appearance-none h-1.5 sm:h-2 cursor-pointer border border-slate-800"
            />
          </div>

          {/* Weather Presets & Toggles */}
          <div className="md:col-span-3 flex items-center justify-between sm:justify-end gap-2 w-full mt-1 sm:mt-0">
            {/* Spotlight Toggle */}
            <button
              onClick={() => {
                setSpotlightsEnabled(p => {
                  const next = !p;
                  if (next) {
                    setSystemNotification("Monitoramento Ativado: Estruturas metálicas em crescimento gradual!");
                  } else {
                    setSystemNotification("Modo Estático: Progresso das estruturas em pausa.");
                  }
                  setTimeout(() => setSystemNotification(null), 4000);
                  return next;
                });
              }}
              className={`py-1.5 px-2.5 rounded-lg border text-[10px] sm:text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1 ${
                spotlightsEnabled 
                  ? 'bg-blue-600/20 border-blue-500 text-blue-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
              }`}
              title="Alternar Holofotes & Simulação de Crescimento"
            >
              <span>💡 {spotlightsEnabled ? 'Monitoramento Ativo' : 'Ativar Monitoramento'}</span>
            </button>

            {/* Building Color Toggle */}
            <button
              onClick={() => {
                const next = buildingColorTheme === 'blue' ? 'sunny' : 'blue';
                setBuildingColorTheme(next);
                setSystemNotification(`Visualização alterada para: ${next === 'blue' ? 'Lona Azul Clássica' : 'Lona Ensolarada Dia'}`);
                setTimeout(() => setSystemNotification(null), 4000);
              }}
              className={`py-1.5 px-2.5 rounded-lg border text-[10px] sm:text-xs font-mono font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                buildingColorTheme === 'sunny' 
                  ? 'bg-amber-600/20 border-amber-500 text-amber-300' 
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-300'
              }`}
              title="Alternar Cor do Prédio (Azul / Ensolarado)"
            >
              <Palette className="w-3.5 h-3.5 text-amber-400" />
              <span>{buildingColorTheme === 'blue' ? 'Cor: Azul' : 'Cor: Sol'}</span>
            </button>

            {/* Breeze preset */}
            <button
              onClick={handleBreezePreset}
              className="py-1.5 px-2.5 rounded-lg bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-[10px] sm:text-[11px] text-slate-300 font-medium transition-all cursor-pointer flex items-center gap-1"
              title="Ativar Brisa Suave"
            >
              <Wind className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-blue-400" />
              <span>Brisa</span>
            </button>

            {/* Storm preset */}
            <button
              onClick={handleStormPreset}
              className="py-1.5 px-2.5 rounded-lg bg-red-950/40 hover:bg-red-900/20 border border-red-900/30 hover:border-red-800/40 text-[10px] sm:text-[11px] text-red-300 font-semibold transition-all cursor-pointer flex items-center gap-1"
              title="Ativar Tempestade Climática"
            >
              <Fan className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-red-400 animate-spin" style={{ animationDuration: '1s' }} />
              <span>Tempestade</span>
            </button>
          </div>

        </div>

      </main>

      {/* FOOTER METADATA */}
      <footer className="w-full text-center py-4 bg-slate-950/80 border-t border-slate-900/60 z-10 text-slate-600 text-[11px] font-mono tracking-wider flex flex-col sm:flex-row justify-between items-center px-12 gap-2">
        <span>© {new Date().getFullYear()} IMÓVEIS & LANÇAMENTOS. RICARDO DE SOUZA OLIVEIRA - CRECI/SP 24.940-J. TODOS OS DIREITOS RESERVADOS.</span>
        <div className="flex gap-4">
          <a href="#" className="hover:text-blue-400 transition-colors">POLÍTICA DE PRIVACIDADE</a>
          <span>•</span>
          <a href="#" className="hover:text-blue-400 transition-colors">MEMORIAL DESCRITIVO</a>
        </div>
      </footer>

      {/* SLIDE-OVER DRAWER/MODAL: SELECTED TOWER INFORMATION */}
      <AnimatePresence>
        {selectedTower && (
          <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm z-40 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0"
              onClick={() => setSelectedTower(null)}
            />
            <div className="relative z-10">
              <TowerInfo 
                tower={selectedTower} 
                onClose={() => setSelectedTower(null)}
                onRegisterInterest={() => {
                  setSelectedTower(null);
                  setShowRegister(true);
                }}
              />
            </div>
          </div>
        )}
      </AnimatePresence>

      {/* REGISTER LEAD MODAL */}
      <AnimatePresence>
        {showRegister && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 cursor-pointer"
              onClick={() => setShowRegister(false)}
            />
            <div className="relative z-10">
              <RegisterForm 
                onSuccess={handleRegisterSuccess} 
                onClose={() => setShowRegister(false)} 
              />
            </div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
