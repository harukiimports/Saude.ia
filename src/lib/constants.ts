// 🎨 Constantes do App de Saúde

export const APP_NAME = 'Assistente de Saúde IA';

export const DEFAULT_ADMIN = {
  username: 'admin',
  password: 'admin',
  role: 'admin' as const,
  name: 'Administrador',
};

// 🎭 Personalidades da IA
export const AI_PERSONALITIES = {
  direct: {
    label: 'Direta e Objetiva',
    description: 'Respostas claras e diretas ao ponto',
    icon: '🎯',
  },
  motivational: {
    label: 'Motivadora',
    description: 'Encorajadora e positiva',
    icon: '💪',
  },
  calm: {
    label: 'Calma e Cuidadosa',
    description: 'Tranquila e detalhada',
    icon: '🧘',
  },
};

// 🩸 Valores de Referência - Glicemia (mg/dL)
export const GLUCOSE_RANGES = {
  fasting: {
    low: 70,
    normal: [70, 100],
    preDiabetic: [100, 125],
    diabetic: 126,
  },
  postMeal: {
    low: 70,
    normal: [70, 140],
    preDiabetic: [140, 199],
    diabetic: 200,
  },
};

// 🧪 Valores de Referência - Colesterol (mg/dL)
export const CHOLESTEROL_RANGES = {
  ldl: {
    optimal: [0, 100],
    nearOptimal: [100, 129],
    borderline: [130, 159],
    high: [160, 189],
    veryHigh: 190,
  },
  hdl: {
    low: 40,
    good: [40, 60],
    optimal: 60,
  },
  triglycerides: {
    normal: [0, 150],
    borderline: [150, 199],
    high: [200, 499],
    veryHigh: 500,
  },
  total: {
    desirable: [0, 200],
    borderline: [200, 239],
    high: 240,
  },
};

// 📊 Pesos do Score de Saúde
export const HEALTH_SCORE_WEIGHTS = {
  glucose: 0.3,
  cholesterol: 0.25,
  medicationAdherence: 0.3,
  dataConsistency: 0.15,
};

// 🎨 Cores do App (Tailwind)
export const COLORS = {
  primary: 'from-blue-500 to-cyan-500',
  success: 'from-emerald-400 to-teal-500',
  warning: 'from-amber-400 to-orange-500',
  danger: 'from-red-400 to-rose-500',
  info: 'from-blue-400 to-indigo-500',
};

// 🚨 Tipos de Alerta
export const ALERT_TYPES = {
  glucose: { label: 'Glicemia', icon: '🩸', color: 'text-red-500' },
  cholesterol: { label: 'Colesterol', icon: '🧪', color: 'text-amber-500' },
  medication: { label: 'Medicação', icon: '💊', color: 'text-blue-500' },
  trend: { label: 'Tendência', icon: '📈', color: 'text-purple-500' },
  critical: { label: 'Crítico', icon: '🚨', color: 'text-red-600' },
};

// 📱 Breakpoints Mobile-First
export const BREAKPOINTS = {
  mobile: '640px',
  tablet: '768px',
  desktop: '1024px',
};

// ⚕️ Aviso Médico Obrigatório
export const MEDICAL_DISCLAIMER = 
  'Este aplicativo não substitui acompanhamento médico profissional. Sempre consulte seu médico antes de tomar decisões sobre sua saúde.';
