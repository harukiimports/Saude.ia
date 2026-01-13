// 🔐 Tipos do Sistema de Saúde com IA

export type UserRole = 'admin' | 'user' | 'caregiver';

export type AIPersonality = 'direct' | 'motivational' | 'calm';

export type RiskLevel = 'low' | 'moderate' | 'high';

export interface User {
  id: string;
  username: string;
  role: UserRole;
  name: string;
  aiPersonality: AIPersonality;
  createdAt: Date;
}

export interface GlucoseReading {
  id: string;
  userId: string;
  value: number;
  timestamp: Date;
  notes?: string;
}

export interface CholesterolReading {
  id: string;
  userId: string;
  ldl: number;
  hdl: number;
  triglycerides: number;
  total: number;
  date: Date;
}

export interface Medication {
  id: string;
  userId: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  context?: string;
  active: boolean;
}

export interface MedicationLog {
  id: string;
  medicationId: string;
  userId: string;
  scheduledTime: Date;
  takenTime?: Date;
  taken: boolean;
  skipped: boolean;
}

export interface HealthScore {
  overall: number;
  glucose: number;
  cholesterol: number;
  medicationAdherence: number;
  dataConsistency: number;
}

export interface Alert {
  id: string;
  userId: string;
  type: 'glucose' | 'cholesterol' | 'medication' | 'trend' | 'critical';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionable: boolean;
}

export interface Appointment {
  id: string;
  userId: string;
  type: 'consultation' | 'exam';
  title: string;
  date: Date;
  location?: string;
  doctor?: string;
  checklist: string[];
  notes?: string;
}

export interface HealthTimeline {
  id: string;
  userId: string;
  type: 'exam' | 'medication_change' | 'alert' | 'milestone';
  title: string;
  description: string;
  date: Date;
  data?: any;
}
