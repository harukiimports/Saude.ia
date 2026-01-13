// 🧪 Dados de Teste - 30 Dias de Histórico

import type {
  GlucoseReading,
  CholesterolReading,
  Medication,
  MedicationLog,
  Alert,
  HealthScore,
} from './types';

// Função auxiliar para gerar datas dos últimos 30 dias
function generateDates(days: number): Date[] {
  const dates: Date[] = [];
  const now = new Date();
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    dates.push(date);
  }
  
  return dates;
}

// Função para gerar valor aleatório dentro de um range
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 🩸 GLICEMIA - 3 medições por dia (manhã, tarde, noite)
export function generateGlucoseData(userId: string): GlucoseReading[] {
  const readings: GlucoseReading[] = [];
  const dates = generateDates(30);
  
  dates.forEach((date, index) => {
    // Manhã (jejum) - 70-110 mg/dL (com algumas variações)
    const morningDate = new Date(date);
    morningDate.setHours(7, randomInRange(0, 30), 0);
    readings.push({
      id: `glucose-${index * 3 + 1}`,
      userId,
      value: randomInRange(75, 115),
      timestamp: morningDate,
      notes: 'Jejum',
    });
    
    // Tarde (pós-almoço) - 100-140 mg/dL
    const afternoonDate = new Date(date);
    afternoonDate.setHours(14, randomInRange(0, 30), 0);
    readings.push({
      id: `glucose-${index * 3 + 2}`,
      userId,
      value: randomInRange(100, 145),
      timestamp: afternoonDate,
      notes: '2h após almoço',
    });
    
    // Noite (antes de dormir) - 90-130 mg/dL
    const nightDate = new Date(date);
    nightDate.setHours(22, randomInRange(0, 30), 0);
    readings.push({
      id: `glucose-${index * 3 + 3}`,
      userId,
      value: randomInRange(90, 135),
      timestamp: nightDate,
      notes: 'Antes de dormir',
    });
  });
  
  return readings;
}

// 🧪 COLESTEROL - 1 exame a cada 7 dias
export function generateCholesterolData(userId: string): CholesterolReading[] {
  const readings: CholesterolReading[] = [];
  const dates = generateDates(30);
  
  // Gerar 4 exames (1 por semana)
  for (let i = 0; i < 4; i++) {
    const date = dates[i * 7];
    const ldl = randomInRange(100, 130);
    const hdl = randomInRange(40, 60);
    const triglycerides = randomInRange(100, 150);
    const total = ldl + hdl + (triglycerides / 5);
    
    readings.push({
      id: `cholesterol-${i + 1}`,
      userId,
      ldl,
      hdl,
      triglycerides,
      total: Math.round(total),
      date,
    });
  }
  
  return readings;
}

// 💊 MEDICAMENTOS
export function generateMedications(userId: string): Medication[] {
  return [
    {
      id: 'med-1',
      userId,
      name: 'Metformina',
      dosage: '850mg',
      frequency: 'Duas vezes ao dia',
      times: ['08:00', '20:00'],
      context: 'Após café da manhã e jantar',
      active: true,
    },
    {
      id: 'med-2',
      userId,
      name: 'Sinvastatina',
      dosage: '20mg',
      frequency: 'Uma vez ao dia',
      times: ['22:00'],
      context: 'Antes de dormir',
      active: true,
    },
    {
      id: 'med-3',
      userId,
      name: 'Losartana',
      dosage: '50mg',
      frequency: 'Uma vez ao dia',
      times: ['08:00'],
      context: 'Pela manhã',
      active: true,
    },
  ];
}

// 📋 LOGS DE MEDICAÇÃO - 30 dias
export function generateMedicationLogs(userId: string, medications: Medication[]): MedicationLog[] {
  const logs: MedicationLog[] = [];
  const dates = generateDates(30);
  
  dates.forEach((date, dayIndex) => {
    medications.forEach((med) => {
      med.times.forEach((time, timeIndex) => {
        const [hours, minutes] = time.split(':').map(Number);
        const scheduledTime = new Date(date);
        scheduledTime.setHours(hours, minutes, 0);
        
        // 85% de adesão (algumas doses esquecidas)
        const taken = Math.random() > 0.15;
        const takenTime = taken ? new Date(scheduledTime.getTime() + randomInRange(-15, 30) * 60000) : undefined;
        
        logs.push({
          id: `log-${dayIndex}-${med.id}-${timeIndex}`,
          medicationId: med.id,
          userId,
          scheduledTime,
          takenTime,
          taken,
          skipped: !taken,
        });
      });
    });
  });
  
  return logs;
}

// 🚨 ALERTAS
export function generateAlerts(userId: string): Alert[] {
  const now = new Date();
  
  return [
    {
      id: 'alert-1',
      userId,
      type: 'trend',
      severity: 'warning',
      title: 'Tendência de Alta na Glicemia Matinal',
      message: 'Suas medições matinais aumentaram 12% esta semana. Considere revisar sua alimentação noturna.',
      timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000), // 2 horas atrás
      read: false,
      actionable: true,
    },
    {
      id: 'alert-2',
      userId,
      type: 'medication',
      severity: 'info',
      title: 'Boa Adesão aos Medicamentos',
      message: 'Você tomou 95% das doses programadas esta semana. Continue assim! 💪',
      timestamp: new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 dia atrás
      read: true,
      actionable: false,
    },
    {
      id: 'alert-3',
      userId,
      type: 'cholesterol',
      severity: 'info',
      title: 'Colesterol Estável',
      message: 'Seu colesterol total está dentro da faixa ideal (180 mg/dL). Mantenha os hábitos saudáveis!',
      timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000), // 3 dias atrás
      read: true,
      actionable: false,
    },
    {
      id: 'alert-4',
      userId,
      type: 'glucose',
      severity: 'warning',
      title: 'Glicemia Pós-Almoço Elevada',
      message: 'Detectamos 3 medições acima de 140 mg/dL após o almoço. Considere reduzir carboidratos.',
      timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // 5 dias atrás
      read: true,
      actionable: true,
    },
  ];
}

// 📊 CALCULAR SCORE DE SAÚDE
export function calculateHealthScore(
  glucoseReadings: GlucoseReading[],
  cholesterolReadings: CholesterolReading[],
  medicationLogs: MedicationLog[]
): HealthScore {
  // Score de Glicemia (0-100)
  const recentGlucose = glucoseReadings.slice(-21); // Últimas 7 dias (3 por dia)
  const avgGlucose = recentGlucose.reduce((sum, r) => sum + r.value, 0) / recentGlucose.length;
  const glucoseScore = avgGlucose <= 110 ? 100 : Math.max(0, 100 - (avgGlucose - 110) * 2);
  
  // Score de Colesterol (0-100)
  const latestCholesterol = cholesterolReadings[cholesterolReadings.length - 1];
  const cholesterolScore = latestCholesterol.total <= 200 ? 100 : Math.max(0, 100 - (latestCholesterol.total - 200));
  
  // Score de Adesão a Medicamentos (0-100)
  const recentLogs = medicationLogs.slice(-21); // Últimos 7 dias
  const adherence = (recentLogs.filter(l => l.taken).length / recentLogs.length) * 100;
  
  // Score de Consistência de Dados (0-100)
  const dataConsistency = 100; // Assumindo que todos os dados foram registrados
  
  // Score Geral (média ponderada)
  const overall = Math.round(
    glucoseScore * 0.35 +
    cholesterolScore * 0.25 +
    adherence * 0.30 +
    dataConsistency * 0.10
  );
  
  return {
    overall,
    glucose: Math.round(glucoseScore),
    cholesterol: Math.round(cholesterolScore),
    medicationAdherence: Math.round(adherence),
    dataConsistency: Math.round(dataConsistency),
  };
}

// 🎯 FUNÇÃO PRINCIPAL - Gerar todos os dados
export function generateMockData(userId: string) {
  const glucoseReadings = generateGlucoseData(userId);
  const cholesterolReadings = generateCholesterolData(userId);
  const medications = generateMedications(userId);
  const medicationLogs = generateMedicationLogs(userId, medications);
  const alerts = generateAlerts(userId);
  const healthScore = calculateHealthScore(glucoseReadings, cholesterolReadings, medicationLogs);
  
  return {
    glucoseReadings,
    cholesterolReadings,
    medications,
    medicationLogs,
    alerts,
    healthScore,
  };
}
