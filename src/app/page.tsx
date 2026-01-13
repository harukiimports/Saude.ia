'use client';

import { useState, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { Heart, Lock, User, AlertCircle } from 'lucide-react';
import { AuthService } from '@/lib/auth';
import { APP_NAME } from '@/lib/constants';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simular delay de autenticação
    setTimeout(() => {
      const user = AuthService.login(username, password);
      
      if (user) {
        router.push('/dashboard');
      } else {
        setError('Usuário ou senha incorretos');
        setIsLoading(false);
      }
    }, 500);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo e Título */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 shadow-2xl">
            <Heart className="h-10 w-10 text-white" fill="white" />
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">{APP_NAME}</h1>
          <p className="text-gray-600">Seu assistente pessoal de saúde</p>
        </div>

        {/* Card de Login */}
        <div className="rounded-2xl bg-white p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Campo Usuário */}
            <div>
              <label htmlFor="username" className="mb-2 block text-sm font-medium text-gray-700">
                Usuário
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-base transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Digite seu usuário"
                  required
                  autoFocus
                />
              </div>
            </div>

            {/* Campo Senha */}
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 py-3 pl-10 pr-4 text-base transition-all focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {/* Mensagem de Erro */}
            {error && (
              <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3 text-sm text-red-600">
                <AlertCircle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Botão de Login */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 py-3 text-base font-semibold text-white shadow-lg transition-all hover:scale-105 hover:shadow-2xl disabled:opacity-50 disabled:hover:scale-100"
            >
              {isLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          {/* Dica de Login */}
          <div className="mt-6 rounded-xl bg-blue-50 p-4">
            <p className="text-center text-sm text-blue-700">
              <strong>Acesso padrão:</strong>
              <br />
              Usuário: <code className="rounded bg-blue-100 px-2 py-1">admin</code>
              <br />
              Senha: <code className="rounded bg-blue-100 px-2 py-1">admin</code>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-500">
          Feito com ❤️ para cuidar da sua saúde
        </p>
      </div>
    </div>
  );
}
