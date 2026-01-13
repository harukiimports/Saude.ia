'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Pill,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  ArrowLeft,
  Bell,
  AlertCircle,
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { generateMockData } from '@/lib/mock-data';
import type { User, Medication, MedicationLog } from '@/lib/types';

export default function MedicationPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mockData, setMockData] = useState<ReturnType<typeof generateMockData> | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
    } else {
      setUser(currentUser);
      const data = generateMockData(currentUser.id);
      setMockData(data);
    }
  }, [router]);

  const handleTakeMedication = (logId: string) => {
    if (!mockData) return;

    const updatedLogs = mockData.medicationLogs.map(log => {
      if (log.id === logId) {
        return {
          ...log,
          taken: true,
          takenTime: new Date(),
          skipped: false,
        };
      }
      return log;
    });

    setMockData({
      ...mockData,
      medicationLogs: updatedLogs,
    });
  };

  if (!user || !mockData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500" />
          <p className="text-gray-600">Carregando medicamentos...</p>
        </div>
      </div>
    );
  }

  const now = new Date();
  const todayLogs = mockData.medicationLogs.filter(log => {
    const logDate = new Date(log.scheduledTime);
    return logDate.toDateString() === now.toDateString();
  });

  const upcomingLogs = todayLogs
    .filter(log => !log.taken && log.scheduledTime > now)
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());

  const takenLogs = todayLogs.filter(log => log.taken);
  const missedLogs = todayLogs.filter(log => !log.taken && log.scheduledTime < now);

  const adherenceRate = todayLogs.length > 0 
    ? Math.round((takenLogs.length / todayLogs.length) * 100)
    : 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <Pill className="h-8 w-8 text-blue-500" />
              <h1 className="text-xl font-bold text-gray-900">Medicamentos</h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Adesão do Dia */}
        <div className="mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-500 p-6 text-white shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold">Adesão de Hoje</h2>
            <div className="rounded-full bg-white/20 backdrop-blur-sm px-4 py-2">
              <span className="text-2xl font-bold">{adherenceRate}%</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
              <CheckCircle2 className="mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">{takenLogs.length}</p>
              <p className="text-sm opacity-90">Tomados</p>
            </div>
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
              <Bell className="mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">{upcomingLogs.length}</p>
              <p className="text-sm opacity-90">Pendentes</p>
            </div>
            <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
              <XCircle className="mx-auto mb-2 h-8 w-8" />
              <p className="text-2xl font-bold">{missedLogs.length}</p>
              <p className="text-sm opacity-90">Perdidos</p>
            </div>
          </div>
        </div>

        {/* Próximos Medicamentos */}
        {upcomingLogs.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
              <Bell className="h-6 w-6 text-blue-500" />
              Próximos Medicamentos
            </h2>
            <div className="space-y-3">
              {upcomingLogs.map((log) => {
                const medication = mockData.medications.find(m => m.id === log.medicationId);
                if (!medication) return null;

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-2xl bg-white p-4 shadow-lg hover:shadow-xl transition-all"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-blue-100 p-3">
                        <Pill className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage} - {medication.context}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4" />
                          {new Date(log.scheduledTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleTakeMedication(log.id)}
                      className="rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition-all"
                    >
                      Confirmar
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Medicamentos Tomados */}
        {takenLogs.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              Tomados Hoje
            </h2>
            <div className="space-y-3">
              {takenLogs.map((log) => {
                const medication = mockData.medications.find(m => m.id === log.medicationId);
                if (!medication) return null;

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-2xl bg-green-50 border-2 border-green-200 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-green-100 p-3">
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage}</p>
                        <div className="flex items-center gap-2 text-sm text-green-600 mt-1">
                          <Clock className="h-4 w-4" />
                          Tomado às {log.takenTime ? new Date(log.takenTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          }) : 'N/A'}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Medicamentos Perdidos */}
        {missedLogs.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-red-500" />
              Doses Perdidas
            </h2>
            <div className="space-y-3">
              {missedLogs.map((log) => {
                const medication = mockData.medications.find(m => m.id === log.medicationId);
                if (!medication) return null;

                return (
                  <div
                    key={log.id}
                    className="flex items-center justify-between rounded-2xl bg-red-50 border-2 border-red-200 p-4"
                  >
                    <div className="flex items-center gap-4">
                      <div className="rounded-full bg-red-100 p-3">
                        <XCircle className="h-6 w-6 text-red-600" />
                      </div>
                      <div>
                        <p className="text-lg font-bold text-gray-900">{medication.name}</p>
                        <p className="text-sm text-gray-600">{medication.dosage}</p>
                        <div className="flex items-center gap-2 text-sm text-red-600 mt-1">
                          <Clock className="h-4 w-4" />
                          Previsto para {new Date(log.scheduledTime).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Lista de Medicamentos Ativos */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-gray-900 flex items-center gap-2">
            <Pill className="h-6 w-6 text-blue-500" />
            Medicamentos Ativos
          </h2>
          <div className="space-y-4">
            {mockData.medications.filter(m => m.active).map((medication) => (
              <div
                key={medication.id}
                className="rounded-xl bg-gray-50 border-2 border-gray-200 p-4"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="text-lg font-bold text-gray-900">{medication.name}</p>
                    <p className="text-sm text-gray-600">{medication.dosage}</p>
                  </div>
                  <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                    Ativo
                  </span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p><strong>Frequência:</strong> {medication.frequency}</p>
                  <p><strong>Horários:</strong> {medication.times.join(', ')}</p>
                  <p><strong>Contexto:</strong> {medication.context}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
