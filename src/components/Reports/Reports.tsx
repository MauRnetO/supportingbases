import React, { useState } from 'react';
import { 
  Download, 
  FileText, 
  Calendar, 
  Users, 
  DollarSign, 
  TrendingUp,
  BarChart3,
  PieChart,
  Filter,
  Printer,
  Mail,
  Share2
} from 'lucide-react';

export default function Reports() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });
  
  const [reportType, setReportType] = useState<'summary' | 'detailed' | 'financial' | 'clients'>('summary');
  const [isGenerating, setIsGenerating] = useState(false);

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
  
  const services = JSON.parse(localStorage.getItem('mockServices') || '[]');
  const businessSettings = JSON.parse(localStorage.getItem('businessSettings') || '{}');

  // Filtrar dados por período
  const startDate = new Date(dateRange.start);
  const endDate = new Date(dateRange.end);
  
  const filteredAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.date);
    return aptDate >= startDate && aptDate <= endDate;
  });

  // Calcular estatísticas do período
  const periodStats = {
    totalAppointments: filteredAppointments.length,
    completedAppointments: filteredAppointments.filter((apt: any) => apt.status === 'completed').length,
    totalRevenue: filteredAppointments
      .filter((apt: any) => apt.status === 'completed')
      .reduce((sum: number, apt: any) => sum + (apt.price || 0), 0),
    newClients: clients.filter((client: any) => {
      const clientDate = new Date(client.createdAt);
      return clientDate >= startDate && clientDate <= endDate;
    }).length,
    averageTicket: 0
  };

  periodStats.averageTicket = periodStats.completedAppointments > 0 
    ? periodStats.totalRevenue / periodStats.completedAppointments 
    : 0;

  const generateReport = async (format: 'pdf' | 'excel' | 'csv') => {
    setIsGenerating(true);
    
    try {
      // Simular geração do relatório
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const reportData = {
        period: {
          start: dateRange.start,
          end: dateRange.end
        },
        business: businessSettings,
        stats: periodStats,
        appointments: filteredAppointments,
        clients: clients,
        services: services,
        generatedAt: new Date().toISOString()
      };

      // Criar e baixar arquivo
      const dataStr = format === 'csv' 
        ? generateCSV(reportData)
        : JSON.stringify(reportData, null, 2);
      
      const dataBlob = new Blob([dataStr], { 
        type: format === 'csv' ? 'text/csv' : 'application/json' 
      });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `relatorio-${reportType}-${dateRange.start}-${dateRange.end}.${format === 'excel' ? 'json' : format}`;
      link.click();
      URL.revokeObjectURL(url);
      
    } catch (error) {
      console.error('Erro ao gerar relatório:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const generateCSV = (data: any) => {
    const headers = ['Data', 'Cliente', 'Serviço', 'Status', 'Valor', 'Duração'];
    const rows = data.appointments.map((apt: any) => {
      const client = data.clients.find((c: any) => c.id === apt.clientId);
      const service = data.services.find((s: any) => s.id === apt.serviceId);
      return [
        apt.date,
        client?.name || 'N/A',
        service?.name || 'N/A',
        apt.status,
        apt.price,
        apt.duration
      ];
    });
    
    return [headers, ...rows].map(row => row.join(',')).join('\n');
  };

  const reportTypes = [
    {
      id: 'summary',
      name: 'Resumo Executivo',
      description: 'Visão geral das principais métricas',
      icon: BarChart3
    },
    {
      id: 'detailed',
      name: 'Relatório Detalhado',
      description: 'Análise completa de agendamentos e receitas',
      icon: FileText
    },
    {
      id: 'financial',
      name: 'Relatório Financeiro',
      description: 'Foco em receitas, custos e lucratividade',
      icon: DollarSign
    },
    {
      id: 'clients',
      name: 'Relatório de Clientes',
      description: 'Análise da base de clientes e comportamento',
      icon: Users
    }
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Relatórios Completos</h1>
          <p className="text-gray-600">Gere relatórios detalhados para análise e impressão</p>
        </div>
      </div>

      {/* Filtros e Configurações */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações do Relatório</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Período */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Período</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Inicial</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Data Final</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Tipo de Relatório */}
          <div className="lg:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-3">Tipo de Relatório</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {reportTypes.map((type) => {
                const Icon = type.icon;
                return (
                  <div
                    key={type.id}
                    onClick={() => setReportType(type.id as any)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      reportType === type.id 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <Icon className={`w-5 h-5 mt-0.5 ${
                        reportType === type.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div>
                        <h4 className={`font-medium ${
                          reportType === type.id ? 'text-blue-900' : 'text-gray-900'
                        }`}>
                          {type.name}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">{type.description}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Prévia das Estatísticas */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Prévia do Período ({new Date(dateRange.start).toLocaleDateString('pt-BR')} - {new Date(dateRange.end).toLocaleDateString('pt-BR')})
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-6 h-6 text-blue-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{periodStats.totalAppointments}</p>
            <p className="text-sm text-gray-600">Total de Agendamentos</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {periodStats.totalRevenue.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Receita Total</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">{periodStats.newClients}</p>
            <p className="text-sm text-gray-600">Novos Clientes</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-orange-600" />
            </div>
            <p className="text-2xl font-bold text-gray-900">R$ {periodStats.averageTicket.toFixed(2)}</p>
            <p className="text-sm text-gray-600">Ticket Médio</p>
          </div>
        </div>
      </div>

      {/* Ações de Geração */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Gerar e Exportar</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => generateReport('pdf')}
            disabled={isGenerating}
            className="flex items-center justify-center px-6 py-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FileText className="w-5 h-5 mr-2" />
            {isGenerating ? 'Gerando...' : 'Gerar PDF'}
          </button>
          
          <button
            onClick={() => generateReport('excel')}
            disabled={isGenerating}
            className="flex items-center justify-center px-6 py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <BarChart3 className="w-5 h-5 mr-2" />
            {isGenerating ? 'Gerando...' : 'Gerar Excel'}
          </button>
          
          <button
            onClick={() => generateReport('csv')}
            disabled={isGenerating}
            className="flex items-center justify-center px-6 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mr-2" />
            {isGenerating ? 'Gerando...' : 'Gerar CSV'}
          </button>
        </div>
        
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="font-medium text-gray-900 mb-3">Ações Adicionais</h4>
          <div className="flex flex-wrap gap-3">
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Printer className="w-4 h-4 mr-2" />
              Imprimir
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Mail className="w-4 h-4 mr-2" />
              Enviar por Email
            </button>
            <button className="flex items-center px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </button>
          </div>
        </div>
      </div>

      {/* Informações sobre os Relatórios */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h4 className="font-medium text-blue-900 mb-3">📊 Sobre os Relatórios</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
          <div>
            <h5 className="font-medium mb-2">Resumo Executivo:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>Métricas principais do período</li>
              <li>Gráficos de performance</li>
              <li>Comparações com períodos anteriores</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Relatório Detalhado:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>Lista completa de agendamentos</li>
              <li>Detalhes de cada transação</li>
              <li>Análise por serviço e cliente</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Relatório Financeiro:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>Receitas por categoria</li>
              <li>Análise de lucratividade</li>
              <li>Projeções e tendências</li>
            </ul>
          </div>
          <div>
            <h5 className="font-medium mb-2">Relatório de Clientes:</h5>
            <ul className="space-y-1 list-disc list-inside">
              <li>Perfil da base de clientes</li>
              <li>Frequência e retenção</li>
              <li>Segmentação por valor</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Estado Vazio */}
      {filteredAppointments.length === 0 && (
        <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 text-center">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum dado encontrado</h3>
          <p className="text-gray-500 mb-4">
            Não há agendamentos no período selecionado para gerar relatórios.
          </p>
          <p className="text-sm text-gray-400">
            Ajuste o período ou adicione mais agendamentos para ver relatórios detalhados.
          </p>
        </div>
      )}
    </div>
  );
}