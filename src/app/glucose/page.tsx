'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Droplets,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  Clock,
  ArrowLeft,
  Activity,
  BarChart3,
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { generateMockData } from '@/lib/mock-data';
import type { User, GlucoseReading } from '@/lib/types';

export default function GlucosePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [mockData, setMockData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newValue, setNewValue] = useState('');
  const [newNotes, setNewNotes] = useState('Jejum');

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

  const handleAddReading = () => {
    if (!newValue || !mockData || !user) return;

    const newReading: GlucoseReading = {
      id: `glucose-new-${Date.now()}`,
      userId: user.id,
      value: parseInt(newValue),
      timestamp: new Date(),
      notes: newNotes,
    };

    setMockData({
      ...mockData,
      glucoseReadings: [...mockData.glucoseReadings, newReading],
    });

    setNewValue('');
    setNewNotes('Jejum');
    setShowAddForm(false);
  };

  if (!user || !mockData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500" />
          <p className="text-gray-600">Carregando dados de glicemia...</p>
        </div>
      </div>
    );
  }

  const recentReadings = mockData.glucoseReadings.slice(-30);
  const avgGlucose = Math.round(
    recentReadings.reduce((sum, r) => sum + r.value, 0) / recentReadings.length
  );
  const minGlucose = Math.min(...recentReadings.map(r => r.value));
  const maxGlucose = Math.max(...recentReadings.map(r => r.value));

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-rose-50 to-pink-50 pb-24">
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
              <Droplets className="h-8 w-8 text-red-500" />
              <h1 className="text-xl font-bold text-gray-900">Glicemia</h1>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 px-4 py-2 text-sm font-semibold text-white shadow-lg hover:scale-105 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Adicionar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Estatísticas Resumidas */}
        <div className="mb-8 grid gap-6 sm:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <BarChart3 className="h-8 w-8 text-blue-500" />
              <span className="text-sm font-medium text-gray-500">Média</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgGlucose}</p>
            <p className="text-sm text-gray-600">mg/dL</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingDown className="h-8 w-8 text-green-500" />
              <span className="text-sm font-medium text-gray-500">Mínima</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{minGlucose}</p>
            <p className="text-sm text-gray-600">mg/dL</p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <TrendingUp className="h-8 w-8 text-red-500" />
              <span className="text-sm font-medium text-gray-500">Máxima</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{maxGlucose}</p>
            <p className="text-sm text-gray-600">mg/dL</p>
          </div>
        </div>

        {/* Lista de Medições */}
        <div className="rounded-2xl bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-red-500" />
            Histórico de Medições
          </h2>
          <div className="space-y-3">
            {recentReadings.reverse().map((reading) => {
              const isHigh = reading.value > 140;
              const isLow = reading.value < 70;
              const isNormal = !isHigh && !isLow;

              return (
                <div
                  key={reading.id}
                  className={`flex items-center justify-between rounded-xl p-4 transition-all hover:shadow-md ${
                    isHigh ? 'bg-red-50 border-2 border-red-200' :
                    isLow ? 'bg-yellow-50 border-2 border-yellow-200' :
                    'bg-gray-50 border-2 border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`rounded-full p-3 ${
                      isHigh ? 'bg-red-100' :
                      isLow ? 'bg-yellow-100' :
                      'bg-green-100'
                    }`}>
                      <Droplets className={`h-6 w-6 ${
                        isHigh ? 'text-red-600' :
                        isLow ? 'text-yellow-600' :
                        'text-green-600'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-2xl font-bold ${
                        isHigh ? 'text-red-700' :
                        isLow ? 'text-yellow-700' :
                        'text-green-700'
                      }`}>
                        {reading.value} mg/dL
                      </p>
                      <p className="text-sm text-gray-600">{reading.notes}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Calendar className="h-4 w-4" />
                      {new Date(reading.timestamp).toLocaleDateString('pt-BR')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Clock className="h-4 w-4" />
                      {new Date(reading.timestamp).toLocaleTimeString('pt-BR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      {/* Modal Adicionar Medição */}
      {showAddForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
            <h3 className="mb-6 text-xl font-bold text-gray-900">Nova Medição</h3>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Valor (mg/dL)
                </label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-lg focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                  placeholder="Ex: 95"
                  autoFocus
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Contexto
                </label>
                <select
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                >
                  <option value="Jejum">Jejum</option>
                  <option value="Pré-refeição">Pré-refeição</option>
                  <option value="2h após almoço">2h após almoço</option>
                  <option value="2h após jantar">2h após jantar</option>
                  <option value="Antes de dormir">Antes de dormir</option>
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 rounded-xl border-2 border-gray-300 py-3 font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleAddReading}
                  className="flex-1 rounded-xl bg-gradient-to-r from-red-500 to-rose-500 py-3 font-semibold text-white shadow-lg hover:scale-105 transition-all"
                >
                  Salvar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
