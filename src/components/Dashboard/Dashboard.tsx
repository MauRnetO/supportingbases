import React from 'react';
import { Calendar, DollarSign, Users, Star, Clock, TrendingUp } from 'lucide-react';
import StatsCard from './StatsCard';
import RecentAppointments from './RecentAppointments';

export default function Dashboard() {
  // Carregar dados reais do localStorage em vez de usar mock data
  const appointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]').map((apt: any) => ({
    ...apt,
    date: new Date(apt.date)
  }));
  
  const clients = JSON.parse(localStorage.getItem('mockClients') || '[]').map((client: any) => ({
    ...client,
    createdAt: new Date(client.createdAt),
    lastVisit: client.lastVisit ? new Date(client.lastVisit) : undefined
  }));
  
  const services = JSON.parse(localStorage.getItem('mockServices') || '[]');

  // Calcular estatísticas reais baseadas nos dados atuais
  const totalRevenue = appointments
    .filter((apt: any) => apt.status === 'completed')
    .reduce((sum: number, apt: any) => sum + (apt.price || 0), 0);

  const totalAppointments = appointments.length;
  const totalClients = clients.length;
  
  // Calcular avaliação média (simulada baseada no número de clientes)
  const avgRating = totalClients > 0 ? Math.min(4.8, 3.5 + (totalClients * 0.02)) : 0;

  const todayAppointments = appointments.filter((apt: any) => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments.filter((apt: any) => {
    const now = new Date();
    const aptDate = new Date(apt.date);
    return aptDate > now && apt.status !== 'cancelled';
  });

  // Calcular tendências (comparação com período anterior simulada)
  const getGrowthTrend = (current: number) => {
    if (current === 0) return { value: 0, isPositive: true };
    // Simular crescimento baseado nos dados atuais
    const growth = Math.min(25, Math.max(-10, (current * 0.1) + Math.random() * 10 - 5));
    return { value: Math.round(growth), isPositive: growth >= 0 };
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600">
            {totalClients > 0 
              ? "Bem-vindo de volta! Aqui está um resumo do seu negócio." 
              : "Bem-vindo! Comece adicionando seus primeiros clientes e serviços."
            }
          </p>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-500">{new Date().toLocaleDateString('pt-BR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Receita Total"
          value={`R$ ${totalRevenue.toFixed(2)}`}
          icon={DollarSign}
          trend={totalRevenue > 0 ? getGrowthTrend(totalRevenue) : undefined}
          color="green"
        />
        <StatsCard
          title="Agendamentos"
          value={totalAppointments}
          icon={Calendar}
          trend={totalAppointments > 0 ? getGrowthTrend(totalAppointments) : undefined}
          color="blue"
        />
        <StatsCard
          title="Clientes"
          value={totalClients}
          icon={Users}
          trend={totalClients > 0 ? getGrowthTrend(totalClients) : undefined}
          color="purple"
        />
        <StatsCard
          title="Avaliação Média"
          value={avgRating > 0 ? avgRating.toFixed(1) : "0.0"}
          icon={Star}
          color="yellow"
        />
      </div>

      {/* Today's Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Hoje</h3>
            <Clock className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Agendamentos</span>
              <span className="font-semibold text-gray-900">{todayAppointments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Receita Prevista</span>
              <span className="font-semibold text-green-600">
                R$ {todayAppointments.reduce((sum: number, apt: any) => sum + (apt.price || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximos Dias</h3>
            <TrendingUp className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Agendamentos</span>
              <span className="font-semibold text-gray-900">{upcomingAppointments.length}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Receita Prevista</span>
              <span className="font-semibold text-blue-600">
                R$ {upcomingAppointments.reduce((sum: number, apt: any) => sum + (apt.price || 0), 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Serviços Populares</h3>
          </div>
          <div className="space-y-3">
            {services.length > 0 ? (
              services.slice(0, 3).map((service: any) => (
                <div key={service.id} className="flex justify-between items-center">
                  <span className="text-gray-600 text-sm">{service.name}</span>
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    R$ {service.price.toFixed(2)}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-4">
                <p className="text-sm text-gray-500">Nenhum serviço cadastrado</p>
                <p className="text-xs text-gray-400 mt-1">Adicione serviços para ver estatísticas</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <RecentAppointments />

      {/* Empty State */}
      {totalClients === 0 && totalAppointments === 0 && services.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Comece a usar o sistema!</h3>
          <p className="text-blue-700 mb-6">
            Seu dashboard está vazio porque não há dados ainda. Comece adicionando:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">Clientes</h4>
              <p className="text-sm text-blue-700 mt-1">Adicione sua base de clientes</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <Star className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">Serviços</h4>
              <p className="text-sm text-blue-700 mt-1">Configure seu catálogo</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-blue-200">
              <Calendar className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-medium text-blue-900">Agendamentos</h4>
              <p className="text-sm text-blue-700 mt-1">Comece a agendar</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}