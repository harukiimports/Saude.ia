'use client';

import { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  iconColor?: string;
  gradient?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  onClick?: () => void;
  children?: ReactNode;
}

export function DashboardCard({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor = 'text-blue-500',
  gradient = 'from-blue-500 to-cyan-500',
  trend,
  onClick,
  children,
}: DashboardCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        relative overflow-hidden rounded-2xl bg-white p-6 shadow-lg
        transition-all duration-300 hover:shadow-2xl
        ${onClick ? 'cursor-pointer hover:scale-105' : ''}
      `}
    >
      {/* Gradiente de fundo sutil */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-5`} />
      
      <div className="relative z-10">
        {/* Header com ícone */}
        <div className="mb-4 flex items-start justify-between">
          <div className={`rounded-xl bg-gradient-to-br ${gradient} p-3 shadow-md`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          
          {trend && (
            <div className={`flex items-center gap-1 text-sm font-semibold ${
              trend.isPositive ? 'text-emerald-500' : 'text-red-500'
            }`}>
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>

        {/* Título */}
        <h3 className="mb-2 text-sm font-medium text-gray-600">{title}</h3>

        {/* Valor principal */}
        <div className="mb-1 text-3xl font-bold text-gray-900">{value}</div>

        {/* Subtítulo */}
        {subtitle && (
          <p className="text-sm text-gray-500">{subtitle}</p>
        )}

        {/* Conteúdo customizado */}
        {children && (
          <div className="mt-4">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
