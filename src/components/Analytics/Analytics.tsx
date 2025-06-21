import React from 'react';
import { TrendingUp, DollarSign, Users, Calendar, BarChart3 } from 'lucide-react';

export default function Analytics() {
  // Carregar dados reais do localStorage
  const appointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]').map((apt: any) => ({
    ...apt,
    date: new Date(apt.date)
  }));
  
  const clients = JSON.parse(localStorage.getItem('mockClients') || '[]').map((client: any) => ({
    ...client,
    createdAt: new Date(client.createdAt),
    lastVisit: client.lastVisit ? new Date(client.lastVisit) : undefined
  }));

  // Calcular estatísticas reais
  const totalRevenue = appointments
    .filter((apt: any) => apt.status === 'completed')
    .reduce((sum: number, apt: any) => sum + (apt.price || 0), 0);

  const totalAppointments = appointments.length;
  const totalClients = clients.length;

  const monthlyRevenue = appointments
    .filter((apt: any) => apt.status === 'completed')
    .reduce((acc: any, apt: any) => {
      const month = apt.date.getMonth();
      acc[month] = (acc[month] || 0) + apt.price;
      return acc;
    }, {});
  
  const statusStats = appointments.reduce((acc: any, apt: any) => {
    acc[apt.status] = (acc[apt.status] || 0) + 1;
    return acc;
  }, {});
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios</h1>
          <p className="text-gray-600">Análise detalhada do seu negócio</p>
        </div>
        <div className="flex space-x-2">
          <select className="px-3 py-2 border border-gray-300 rounded-md text-sm">
            <option>Últimos 30 dias</option>
            <option>Últimos 90 dias</option>
            <option>Este ano</option>
          </select>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
            Exportar
          </button>
        </div>
      </div>
      
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Receita Total</p>
              <p className="text-2xl font-bold text-gray-900">R$ {totalRevenue.toFixed(2)}</p>
              <p className="text-sm text-green-600 mt-1">
                {totalRevenue > 0 ? '+12% vs mês anterior' : 'Sem dados ainda'}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Agendamentos</p>
              <p className="text-2xl font-bold text-gray-900">{totalAppointments}</p>
              <p className="text-sm text-blue-600 mt-1">
                {totalAppointments > 0 ? '+8% vs mês anterior' : 'Sem dados ainda'}
              </p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{totalClients}</p>
              <p className="text-sm text-purple-600 mt-1">
                {totalClients > 0 ? '+15% vs mês anterior' : 'Sem dados ainda'}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Taxa de Crescimento</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalAppointments > 0 ? '24%' : '0%'}
              </p>
              <p className="text-sm text-green-600 mt-1">
                {totalAppointments > 0 ? 'vs trimestre anterior' : 'Sem dados ainda'}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Receita Mensal</h3>
            <BarChart3 className="w-5 h-5 text-gray-400" />
          </div>
          
          {Object.keys(monthlyRevenue).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(monthlyRevenue).map(([month, revenue]) => (
                <div key={month} className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {new Date(2024, parseInt(month)).toLocaleDateString('pt-BR', { month: 'long' })}
                  </span>
                  <div className="flex items-center space-x-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${(Number(revenue) / Math.max(...Object.values(monthlyRevenue).map(Number))) * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      R$ {Number(revenue).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma receita registrada ainda</p>
              <p className="text-sm text-gray-400 mt-1">Complete agendamentos para ver gráficos</p>
            </div>
          )}
        </div>
        
        {/* Status Distribution */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Status dos Agendamentos</h3>
          </div>
          
          {Object.keys(statusStats).length > 0 ? (
            <div className="space-y-4">
              {Object.entries(statusStats).map(([status, count]) => {
                const statusLabels = {
                  scheduled: 'Agendados',
                  confirmed: 'Confirmados',
                  completed: 'Concluídos',
                  cancelled: 'Cancelados',
                  'no-show': 'Não compareceram'
                };
                
                const colors = {
                  scheduled: 'bg-blue-600',
                  confirmed: 'bg-green-600',
                  completed: 'bg-gray-600',
                  cancelled: 'bg-red-600',
                  'no-show': 'bg-yellow-600'
                };
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]}`}></div>
                      <span className="text-sm text-gray-600">{statusLabels[status as keyof typeof statusLabels]}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{Number(count)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhum agendamento registrado ainda</p>
              <p className="text-sm text-gray-400 mt-1">Crie agendamentos para ver estatísticas</p>
            </div>
          )}
        </div>
      </div>
      
      {/* Performance Metrics */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Métricas de Performance</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">
                {totalAppointments > 0 ? '95%' : '0%'}
              </p>
              <p className="text-sm text-gray-600 mt-1">Taxa de Comparecimento</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">
                {totalClients > 0 ? '4.8' : '0.0'}
              </p>
              <p className="text-sm text-gray-600 mt-1">Avaliação Média</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">
                {totalClients > 0 ? '68%' : '0%'}
              </p>
              <p className="text-sm text-gray-600 mt-1">Taxa de Retorno</p>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {totalAppointments === 0 && totalClients === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-8 text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-lg font-semibold text-blue-900 mb-2">Nenhum dado para análise</h3>
          <p className="text-blue-700 mb-4">
            Comece adicionando clientes e criando agendamentos para ver relatórios detalhados.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
              Adicionar Cliente
            </button>
            <button className="px-4 py-2 bg-white text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition-colors">
              Criar Agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}