import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: 'blue' | 'green' | 'yellow' | 'purple';
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-50',
    icon: 'text-blue-600',
    trend: 'text-blue-600'
  },
  green: {
    bg: 'bg-green-50',
    icon: 'text-green-600',
    trend: 'text-green-600'
  },
  yellow: {
    bg: 'bg-yellow-50',
    icon: 'text-yellow-600',
    trend: 'text-yellow-600'
  },
  purple: {
    bg: 'bg-purple-50',
    icon: 'text-purple-600',
    trend: 'text-purple-600'
  }
};

export default function StatsCard({ title, value, icon: Icon, trend, color }: StatsCardProps) {
  const colors = colorClasses[color];
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {trend && (
            <div className="flex items-center mt-2">
              <span className={`text-sm font-medium ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
              </span>
              <span className="text-sm text-gray-500 ml-1">vs mês anterior</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${colors.bg}`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>
      </div>
    </div>
  );
}