'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  Heart,
  MessageCircle,
  Send,
  ArrowLeft,
  Loader2,
  Sparkles,
  User,
  Bot,
} from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { generateMockData } from '@/lib/mock-data';
import type { User as UserType } from '@/lib/types';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AIAssistantPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserType | null>(null);
  const [mockData, setMockData] = useState<ReturnType<typeof generateMockData> | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();
    if (!currentUser) {
      router.push('/');
    } else {
      setUser(currentUser);
      const data = generateMockData(currentUser.id);
      setMockData(data);

      // Mensagem de boas-vindas
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: `Olá, ${currentUser.name}! 👋 Sou seu assistente de saúde com IA. Posso ajudá-lo a entender seus dados de glicemia, colesterol, medicamentos e muito mais. Como posso ajudar hoje?`,
          timestamp: new Date(),
        },
      ]);
    }
  }, [router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim() || !mockData || !user) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simular resposta da IA (em produção, chamar API real)
    setTimeout(() => {
      const response = generateAIResponse(input, mockData);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const generateAIResponse = (query: string, data: ReturnType<typeof generateMockData>): string => {
    const lowerQuery = query.toLowerCase();

    // Respostas baseadas em palavras-chave
    if (lowerQuery.includes('glicemia') || lowerQuery.includes('açúcar') || lowerQuery.includes('diabetes')) {
      const latest = data.glucoseReadings[data.glucoseReadings.length - 1];
      const recent = data.glucoseReadings.slice(-7);
      const avg = Math.round(recent.reduce((sum, r) => sum + r.value, 0) / recent.length);
      
      return `📊 Sua última medição de glicemia foi de **${latest.value} mg/dL** (${latest.notes}). Nos últimos 7 dias, sua média está em **${avg} mg/dL**.\n\n${
        avg <= 110 ? '✅ Sua glicemia está bem controlada! Continue assim.' :
        avg <= 140 ? '⚠️ Sua glicemia está um pouco elevada. Considere revisar sua alimentação e prática de exercícios.' :
        '🚨 Sua glicemia está elevada. Recomendo conversar com seu médico sobre ajustes no tratamento.'
      }\n\n💡 **Dica:** Mantenha um registro regular das medições para identificar padrões.`;
    }

    if (lowerQuery.includes('colesterol')) {
      const latest = data.cholesterolReadings[data.cholesterolReadings.length - 1];
      
      return `🧪 Seu último exame de colesterol:\n\n• **Total:** ${latest.total} mg/dL\n• **LDL (ruim):** ${latest.ldl} mg/dL\n• **HDL (bom):** ${latest.hdl} mg/dL\n• **Triglicerídeos:** ${latest.triglycerides} mg/dL\n\n${
        latest.total <= 200 ? '✅ Seu colesterol está dentro da faixa ideal!' :
        latest.total <= 240 ? '⚠️ Seu colesterol está no limite. Atenção à alimentação.' :
        '🚨 Colesterol elevado. Consulte seu médico.'
      }`;
    }

    if (lowerQuery.includes('medicamento') || lowerQuery.includes('remédio') || lowerQuery.includes('medicação')) {
      const adherence = data.healthScore.medicationAdherence;
      
      return `💊 Sobre seus medicamentos:\n\n• **Adesão:** ${adherence}%\n• **Medicamentos ativos:** ${data.medications.length}\n\n${
        adherence >= 90 ? '🎉 Excelente adesão! Continue tomando seus medicamentos corretamente.' :
        adherence >= 70 ? '👍 Boa adesão, mas há espaço para melhorar. Tente configurar lembretes.' :
        '⚠️ Sua adesão está baixa. Isso pode comprometer seu tratamento. Vamos trabalhar nisso juntos!'
      }\n\n💡 **Lembrete:** Nunca interrompa ou altere medicamentos sem orientação médica.`;
    }

    if (lowerQuery.includes('score') || lowerQuery.includes('saúde') || lowerQuery.includes('como estou')) {
      const score = data.healthScore.overall;
      
      return `🎯 Seu Score de Saúde Metabólica é **${score}/100**\n\n**Detalhamento:**\n• Glicemia: ${data.healthScore.glucose}%\n• Colesterol: ${data.healthScore.cholesterol}%\n• Adesão Medicação: ${data.healthScore.medicationAdherence}%\n• Consistência: ${data.healthScore.dataConsistency}%\n\n${
        score >= 80 ? '🌟 Excelente! Você está cuidando muito bem da sua saúde!' :
        score >= 60 ? '💪 Muito bom! Continue assim e busque melhorar ainda mais.' :
        score >= 40 ? '⚠️ Atenção necessária. Vamos trabalhar juntos para melhorar.' :
        '🚨 Precisa de cuidados. Recomendo conversar com seu médico urgentemente.'
      }`;
    }

    if (lowerQuery.includes('alerta') || lowerQuery.includes('aviso')) {
      const unread = data.alerts.filter(a => !a.read).length;
      
      return `🔔 Você tem **${unread} alertas não lidos**.\n\n${
        unread > 0 ? 'Recomendo verificar seus alertas no dashboard para não perder informações importantes sobre sua saúde.' :
        'Tudo certo! Não há alertas pendentes no momento.'
      }`;
    }

    // Resposta padrão
    return `Entendo sua pergunta sobre "${query}". Posso ajudá-lo com:\n\n• 📊 Análise de glicemia e tendências\n• 🧪 Interpretação de exames de colesterol\n• 💊 Acompanhamento de medicamentos\n• 🎯 Explicação do seu score de saúde\n• 🔔 Verificação de alertas\n\nO que você gostaria de saber especificamente?`;
  };

  if (!user || !mockData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
        <div className="text-center">
          <Heart className="mx-auto mb-4 h-12 w-12 animate-pulse text-blue-500" />
          <p className="text-gray-600">Carregando assistente...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-sm border-b border-gray-100">
        <div className="mx-auto max-w-4xl px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span className="font-medium">Voltar</span>
            </button>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-2">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Assistente IA</h1>
            </div>
            <div className="w-20" />
          </div>
        </div>
      </header>

      {/* Mensagens */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-4xl px-4 py-6 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {message.role === 'assistant' && (
                <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-2">
                  <Bot className="h-5 w-5 text-white" />
                </div>
              )}
              <div
                className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white'
                    : 'bg-white shadow-lg text-gray-900'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</p>
                <p className={`mt-2 text-xs ${
                  message.role === 'user' ? 'text-white/70' : 'text-gray-500'
                }`}>
                  {message.timestamp.toLocaleTimeString('pt-BR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              {message.role === 'user' && (
                <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 p-2">
                  <User className="h-5 w-5 text-white" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex-shrink-0 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 p-2">
                <Bot className="h-5 w-5 text-white" />
              </div>
              <div className="rounded-2xl bg-white shadow-lg px-4 py-3">
                <Loader2 className="h-5 w-5 animate-spin text-purple-500" />
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input */}
      <div className="sticky bottom-0 bg-white/80 backdrop-blur-lg border-t border-gray-200 p-4">
        <div className="mx-auto max-w-4xl">
          <div className="flex gap-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Digite sua pergunta..."
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20"
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-3 font-semibold text-white shadow-lg hover:scale-105 transition-all disabled:opacity-50 disabled:hover:scale-100"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-gray-500">
            ⚕️ Este assistente não substitui acompanhamento médico profissional
          </p>
        </div>
      </div>
    </div>
  );
}
