'use client';

// 🔐 Sistema de Autenticação Simples (Client-Side)
// Preparado para migração futura para Supabase

import { User, UserRole } from './types';
import { DEFAULT_ADMIN } from './constants';

const AUTH_STORAGE_KEY = 'health_app_user';

export class AuthService {
  // Login simples (preparado para API futura)
  static login(username: string, password: string): User | null {
    // Validação do admin padrão
    if (username === DEFAULT_ADMIN.username && password === DEFAULT_ADMIN.password) {
      const user: User = {
        id: 'admin-001',
        username: DEFAULT_ADMIN.username,
        role: DEFAULT_ADMIN.role,
        name: DEFAULT_ADMIN.name,
        aiPersonality: 'direct',
        createdAt: new Date(),
      };
      
      this.setCurrentUser(user);
      return user;
    }

    // TODO: Adicionar validação de outros usuários via API/Supabase
    return null;
  }

  // Logout
  static logout(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }

  // Obter usuário atual
  static getCurrentUser(): User | null {
    if (typeof window === 'undefined') return null;
    
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    try {
      const user = JSON.parse(stored);
      // Reconverter data
      user.createdAt = new Date(user.createdAt);
      return user;
    } catch {
      return null;
    }
  }

  // Salvar usuário atual
  static setCurrentUser(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
    }
  }

  // Verificar se está autenticado
  static isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  // Verificar permissão por role
  static hasRole(role: UserRole): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  // Verificar se é admin
  static isAdmin(): boolean {
    return this.hasRole('admin');
  }

  // Atualizar personalidade da IA
  static updateAIPersonality(personality: 'direct' | 'motivational' | 'calm'): void {
    const user = this.getCurrentUser();
    if (user) {
      user.aiPersonality = personality;
      this.setCurrentUser(user);
    }
  }
}

// Hook para usar em componentes React
export function useAuth() {
  if (typeof window === 'undefined') {
    return {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      login: () => null,
      logout: () => {},
    };
  }

  return {
    user: AuthService.getCurrentUser(),
    isAuthenticated: AuthService.isAuthenticated(),
    isAdmin: AuthService.isAdmin(),
    login: AuthService.login,
    logout: AuthService.logout,
  };
}
