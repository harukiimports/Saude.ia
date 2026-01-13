'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  Activity,
  Pill,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Calendar,
  Settings,
  LogOut,
  Menu,
  X,
  Droplets,
  TestTube,
  Bell,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Clock,
  BarChart3,
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { DashboardCard } from '@/components/custom/dashboard-card';
import { HealthScoreCircle } from '@/components/custom/health-score-circle';
import { APP_NAME, MEDICAL_DISCLAIMER } from '@/lib/constants';
import { generateMockData } from '@/lib/mock-data';
import type { User, GlucoseReading, Alert, HealthScore } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [mockData, setMockData] = useState<ReturnType<typeof generateMockData> | null>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
    } else {
      setUser(currentUser);
      // Gerar dados de teste
      const data = generateMockData(currentUser.id);
      setMockData(data);
    }
  }, [router]);

  const handleLogout = () => {
    AuthService.logout();
    router.push('/');
  };

  if (!user || !mockData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500" />
          <p className="text-gray-600">Carregando seus dados de saúde...</p>
        </div>
      </div>
    );
  }

  // Dados mais recentes
  const latestGlucose = mockData.glucoseReadings[mockData.glucoseReadings.length - 1];
  const latestCholesterol = mockData.cholesterolReadings[mockData.cholesterolReadings.length - 1];
  const recentGlucose = mockData.glucoseReadings.slice(-7); // Últimos 7 registros
  const avgGlucose = Math.round(recentGlucose.reduce((sum, r) => sum + r.value, 0) / recentGlucose.length);
  
  // Próximo medicamento
  const now = new Date();
  const upcomingMeds = mockData.medicationLogs
    .filter(log => !log.taken && log.scheduledTime > now)
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
  const nextMed = upcomingMeds[0];
  const nextMedication = mockData.medications.find(m => m.id === nextMed?.medicationId);

  // Alertas não lidos
  const unreadAlerts = mockData.alerts.filter(a => !a.read);

  // Calcular tendência de glicemia
  const glucoseTrend = latestGlucose.value - recentGlucose[0].value;
  const isTrendPositive = glucoseTrend < 0; // Menor é melhor para glicemia

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 pb-20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            {/* Logo e Título */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg">
                <Heart className="h-6 w-6 text-white" fill="white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 sm:text-xl">{APP_NAME}</h1>
                <p className="text-xs text-gray-600">Olá, {user.name} 👋</p>
              </div>
            </div>

            {/* Menu Mobile */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="rounded-xl p-2 hover:bg-gray-100 sm:hidden transition-colors"
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Menu Desktop */}
            <div className="hidden items-center gap-4 sm:flex">
              <button className="relative rounded-xl p-2 hover:bg-gray-100 transition-colors">
                <Bell className="h-6 w-6 text-gray-600" />
                {unreadAlerts.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>
              <button className="rounded-xl p-2 hover:bg-gray-100 transition-colors">
                <Settings className="h-6 w-6 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                Sair
              </button>
            </div>
          </div>

          {/* Menu Mobile Expandido */}
          {menuOpen && (
            <div className="mt-4 space-y-2 border-t pt-4 sm:hidden animate-in slide-in-from-top">
              <button className="flex w-full items-center gap-3 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                <Bell className="h-5 w-5 text-gray-600" />
                <span>Notificações</span>
                {unreadAlerts.length > 0 && (
                  <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
                    {unreadAlerts.length}
                  </span>
                )}
              </button>
              <button className="flex w-full items-center gap-3 rounded-xl p-3 hover:bg-gray-100 transition-colors">
                <Settings className="h-5 w-5 text-gray-600" />
                <span>Configurações</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-xl bg-red-50 p-3 text-red-600 hover:bg-red-100 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sair</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {/* Score de Saúde - Destaque com Círculo de Água */}
        <div className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-blue-500 via-cyan-500 to-teal-500 p-8 text-white shadow-2xl">
          <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:justify-between">
            {/* Círculo com efeito de água */}
            <div className="flex-shrink-0">
              <HealthScoreCircle score={mockData.healthScore.overall} size={200} />
            </div>
            
            {/* Informações ao lado */}
            <div className="flex-1 text-center sm:text-left">
              <p className="mb-2 text-sm font-medium opacity-90">Score de Saúde Metabólica</p>
              <p className="mb-6 text-2xl font-bold">
                {mockData.healthScore.overall >= 80 ? 'Excelente! 🎉' : 
                 mockData.healthScore.overall >= 60 ? 'Muito bom! 💪' :
                 mockData.healthScore.overall >= 40 ? 'Atenção necessária ⚠️' :
                 'Precisa de cuidados 🚨'}
              </p>
              
              {/* Indicadores detalhados */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm opacity-90">Glicemia</span>
                    <span className="text-lg font-bold">{mockData.healthScore.glucose}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${mockData.healthScore.glucose}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm opacity-90">Colesterol</span>
                    <span className="text-lg font-bold">{mockData.healthScore.cholesterol}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${mockData.healthScore.cholesterol}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm opacity-90">Medicação</span>
                    <span className="text-lg font-bold">{mockData.healthScore.medicationAdherence}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${mockData.healthScore.medicationAdherence}%` }}
                    />
                  </div>
                </div>

                <div className="rounded-xl bg-white/20 backdrop-blur-sm p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm opacity-90">Consistência</span>
                    <span className="text-lg font-bold">{mockData.healthScore.dataConsistency}%</span>
                  </div>
                  <div className="h-2 bg-white/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-white rounded-full transition-all duration-1000"
                      style={{ width: `${mockData.healthScore.dataConsistency}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Cards Principais */}
        <div className="mb-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DashboardCard
            title="Última Glicemia"
            value={`${latestGlucose.value} mg/dL`}
            subtitle={`${new Date(latestGlucose.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })} - ${latestGlucose.notes}`}
            icon={Droplets}
            gradient="from-red-400 to-rose-500"
            trend={{ 
              value: Math.abs(glucoseTrend), 
              isPositive: isTrendPositive 
            }}
          />

          <DashboardCard
            title="Média 7 Dias"
            value={`${avgGlucose} mg/dL`}
            subtitle={`${recentGlucose.length} medições`}
            icon={BarChart3}
            gradient="from-purple-400 to-pink-500"
          />

          <DashboardCard
            title="Colesterol Total"
            value={`${latestCholesterol.total} mg/dL`}
            subtitle={`LDL: ${latestCholesterol.ldl} | HDL: ${latestCholesterol.hdl}`}
            icon={TestTube}
            gradient="from-amber-400 to-orange-500"
          />

          <DashboardCard
            title="Próximo Medicamento"
            value={nextMed ? new Date(nextMed.scheduledTime).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) : 'Nenhum'}
            subtitle={nextMedication ? `${nextMedication.name} ${nextMedication.dosage}` : 'Todos tomados hoje'}
            icon={Pill}
            gradient="from-blue-400 to-indigo-500"
          />

          <DashboardCard
            title="Adesão Medicação"
            value={`${mockData.healthScore.medicationAdherence}%`}
            subtitle="Últimos 7 dias"
            icon={CheckCircle2}
            gradient="from-emerald-400 to-teal-500"
          />

          <DashboardCard
            title="Alertas Ativos"
            value={`${unreadAlerts.length}`}
            subtitle={unreadAlerts.length > 0 ? 'Requerem atenção' : 'Tudo certo!'}
            icon={AlertTriangle}
            gradient="from-orange-400 to-red-500"
          />
        </div>

        {/* Alertas Importantes */}
        {mockData.alerts.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-amber-500" />
              Alertas e Recomendações
            </h2>
            <div className="space-y-3">
              {mockData.alerts.slice(0, 3).map((alert) => (
                <div 
                  key={alert.id}
                  className={`flex items-start gap-4 rounded-2xl p-4 shadow-lg transition-all hover:shadow-xl ${
                    alert.severity === 'critical' ? 'bg-red-50 border-2 border-red-200' :
                    alert.severity === 'warning' ? 'bg-amber-50 border-2 border-amber-200' :
                    'bg-blue-50 border-2 border-blue-200'
                  }`}
                >
                  <div className={`flex-shrink-0 rounded-full p-2 ${
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'warning' ? 'bg-amber-100' :
                    'bg-blue-100'
                  }`}>
                    {alert.severity === 'critical' ? (
                      <XCircle className="h-6 w-6 text-red-600" />
                    ) : alert.severity === 'warning' ? (
                      <AlertTriangle className="h-6 w-6 text-amber-600" />
                    ) : (
                      <CheckCircle2 className="h-6 w-6 text-blue-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <h3 className={`font-semibold mb-1 ${
                      alert.severity === 'critical' ? 'text-red-900' :
                      alert.severity === 'warning' ? 'text-amber-900' :
                      'text-blue-900'
                    }`}>
                      {alert.title}
                    </h3>
                    <p className={`text-sm mb-2 ${
                      alert.severity === 'critical' ? 'text-red-700' :
                      alert.severity === 'warning' ? 'text-amber-700' :
                      'text-blue-700'
                    }`}>
                      {alert.message}
                    </p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      {new Date(alert.timestamp).toLocaleString('pt-BR')}
                    </div>
                  </div>
                  {alert.actionable && (
                    <button className={`flex-shrink-0 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                      alert.severity === 'critical' ? 'bg-red-600 text-white hover:bg-red-700' :
                      alert.severity === 'warning' ? 'bg-amber-600 text-white hover:bg-amber-700' :
                      'bg-blue-600 text-white hover:bg-blue-700'
                    }`}>
                      Ver Mais
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Ações Rápidas */}
        <div className="mb-8">
          <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
            <Activity className="h-6 w-6 text-blue-500" />
            Ações Rápidas
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <button 
              onClick={() => router.push('/glucose')}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="rounded-full bg-gradient-to-br from-red-400 to-rose-500 p-4 transition-transform group-hover:scale-110">
                <Droplets className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Registrar Glicemia</span>
            </button>

            <button 
              onClick={() => router.push('/medication')}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 p-4 transition-transform group-hover:scale-110">
                <Pill className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Confirmar Medicação</span>
            </button>

            <button 
              onClick={() => router.push('/ai')}
              className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl"
            >
              <div className="rounded-full bg-gradient-to-br from-purple-400 to-pink-500 p-4 transition-transform group-hover:scale-110">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Falar com IA</span>
            </button>

            <button className="group flex flex-col items-center gap-3 rounded-2xl bg-white p-6 shadow-lg transition-all hover:scale-105 hover:shadow-2xl">
              <div className="rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 p-4 transition-transform group-hover:scale-110">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-900">Agendar Consulta</span>
            </button>
          </div>
        </div>

        {/* Resumo Semanal */}
        <div className="mb-8 rounded-3xl bg-white p-6 shadow-lg">
          <h2 className="mb-4 text-xl font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-green-500" />
            Resumo dos Últimos 7 Dias
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Medições de Glicemia</p>
              <p className="text-3xl font-bold text-blue-600">{recentGlucose.length}</p>
              <p className="text-xs text-gray-500 mt-1">Média: {avgGlucose} mg/dL</p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Medicações Tomadas</p>
              <p className="text-3xl font-bold text-green-600">
                {mockData.medicationLogs.slice(-21).filter(l => l.taken).length}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                de {mockData.medicationLogs.slice(-21).length} programadas
              </p>
            </div>
            <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-4">
              <p className="text-sm text-gray-600 mb-1">Alertas Gerados</p>
              <p className="text-3xl font-bold text-purple-600">{mockData.alerts.length}</p>
              <p className="text-xs text-gray-500 mt-1">{unreadAlerts.length} não lidos</p>
            </div>
          </div>
        </div>

        {/* Aviso Médico */}
        <div className="rounded-2xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6 text-center border-2 border-blue-200">
          <p className="text-sm text-blue-800 font-medium">
            ⚕️ {MEDICAL_DISCLAIMER}
          </p>
        </div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white shadow-2xl sm:hidden border-t border-gray-200">
        <div className="flex items-center justify-around py-3">
          <button 
            onClick={() => router.push('/dashboard')}
            className="flex flex-col items-center gap-1 text-blue-500 transition-colors"
          >
            <Activity className="h-6 w-6" />
            <span className="text-xs font-medium">Dashboard</span>
          </button>
          <button 
            onClick={() => router.push('/glucose')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Droplets className="h-6 w-6" />
            <span className="text-xs font-medium">Glicemia</span>
          </button>
          <button 
            onClick={() => router.push('/medication')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Pill className="h-6 w-6" />
            <span className="text-xs font-medium">Remédios</span>
          </button>
          <button 
            onClick={() => router.push('/ai')}
            className="flex flex-col items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <MessageCircle className="h-6 w-6" />
            <span className="text-xs font-medium">IA</span>
          </button>
        </div>
      </nav>
    </div>
  );
}
