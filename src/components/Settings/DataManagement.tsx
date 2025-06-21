import React, { useState } from 'react';
import { 
  Trash2, 
  RotateCcw, 
  AlertTriangle, 
  Calendar, 
  Users, 
  Briefcase, 
  DollarSign,
  Download,
  Upload,
  Database,
  Clock,
  CheckCircle,
  XCircle,
  Info,
  Shield,
  Archive,
  RefreshCw,
  Target,
  Zap
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface ResetOptions {
  appointments: boolean;
  clients: boolean;
  services: boolean;
  notifications: boolean;
  messageLogs: boolean;
  appearanceSettings: boolean;
  businessSettings: boolean;
  workingHours: boolean;
  automaticMessages: boolean;
  messageTemplates: boolean;
}

interface BackupData {
  id: string;
  name: string;
  date: Date;
  size: string;
  items: string[];
}

export default function DataManagement() {
  const [resetOptions, setResetOptions] = useState<ResetOptions>({
    appointments: false,
    clients: false,
    services: false,
    notifications: false,
    messageLogs: false,
    appearanceSettings: false,
    businessSettings: false,
    workingHours: false,
    automaticMessages: false,
    messageTemplates: false
  });

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [resetType, setResetType] = useState<'partial' | 'complete' | 'date-range'>('partial');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [isResetting, setIsResetting] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [backupBeforeReset, setBackupBeforeReset] = useState(true);

  // Mock backups data
  const [backups] = useLocalStorage<BackupData[]>('systemBackups', [
    {
      id: '1',
      name: 'Backup Automático - Dezembro 2024',
      date: new Date('2024-12-15'),
      size: '2.3 MB',
      items: ['Agendamentos', 'Clientes', 'Serviços', 'Configurações']
    },
    {
      id: '2',
      name: 'Backup Manual - Novembro 2024',
      date: new Date('2024-11-30'),
      size: '1.8 MB',
      items: ['Agendamentos', 'Clientes', 'Relatórios']
    }
  ]);

  const dataCategories = [
    {
      key: 'appointments' as keyof ResetOptions,
      name: 'Agendamentos',
      description: 'Todos os agendamentos e histórico',
      icon: Calendar,
      color: 'blue',
      count: JSON.parse(localStorage.getItem('mockAppointments') || '[]').length
    },
    {
      key: 'clients' as keyof ResetOptions,
      name: 'Clientes',
      description: 'Base de clientes e informações',
      icon: Users,
      color: 'green',
      count: JSON.parse(localStorage.getItem('mockClients') || '[]').length
    },
    {
      key: 'services' as keyof ResetOptions,
      name: 'Serviços',
      description: 'Catálogo de serviços e preços',
      icon: Briefcase,
      color: 'purple',
      count: JSON.parse(localStorage.getItem('mockServices') || '[]').length
    },
    {
      key: 'notifications' as keyof ResetOptions,
      name: 'Notificações',
      description: 'Histórico de notificações',
      icon: Info,
      color: 'yellow',
      count: JSON.parse(localStorage.getItem('systemNotifications') || '[]').length
    },
    {
      key: 'messageLogs' as keyof ResetOptions,
      name: 'Logs de Mensagens',
      description: 'Histórico de mensagens enviadas',
      icon: Database,
      color: 'indigo',
      count: JSON.parse(localStorage.getItem('messageLogs') || '[]').length
    },
    {
      key: 'appearanceSettings' as keyof ResetOptions,
      name: 'Configurações de Aparência',
      description: 'Temas, cores e personalização',
      icon: Shield,
      color: 'pink',
      count: 1
    },
    {
      key: 'businessSettings' as keyof ResetOptions,
      name: 'Configurações do Negócio',
      description: 'Dados da empresa e configurações',
      icon: Target,
      color: 'orange',
      count: 1
    },
    {
      key: 'workingHours' as keyof ResetOptions,
      name: 'Horários de Funcionamento',
      description: 'Configurações de horários',
      icon: Clock,
      color: 'teal',
      count: 7
    },
    {
      key: 'automaticMessages' as keyof ResetOptions,
      name: 'Mensagens Automáticas',
      description: 'Configurações de mensagens',
      icon: Zap,
      color: 'red',
      count: JSON.parse(localStorage.getItem('automaticMessages') || '[]').length
    },
    {
      key: 'messageTemplates' as keyof ResetOptions,
      name: 'Modelos de Mensagem',
      description: 'Templates de mensagens',
      icon: Archive,
      color: 'gray',
      count: JSON.parse(localStorage.getItem('messageTemplates') || '[]').length
    }
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
    pink: 'bg-pink-50 text-pink-700 border-pink-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
    teal: 'bg-teal-50 text-teal-700 border-teal-200',
    red: 'bg-red-50 text-red-700 border-red-200',
    gray: 'bg-gray-50 text-gray-700 border-gray-200'
  };

  const iconColorClasses = {
    blue: 'text-blue-600',
    green: 'text-green-600',
    purple: 'text-purple-600',
    yellow: 'text-yellow-600',
    indigo: 'text-indigo-600',
    pink: 'text-pink-600',
    orange: 'text-orange-600',
    teal: 'text-teal-600',
    red: 'text-red-600',
    gray: 'text-gray-600'
  };

  const handleResetOptionChange = (key: keyof ResetOptions, value: boolean) => {
    setResetOptions(prev => ({ ...prev, [key]: value }));
  };

  const selectAllData = () => {
    const allSelected = Object.values(resetOptions).every(v => v);
    const newState = !allSelected;
    
    setResetOptions({
      appointments: newState,
      clients: newState,
      services: newState,
      notifications: newState,
      messageLogs: newState,
      appearanceSettings: newState,
      businessSettings: newState,
      workingHours: newState,
      automaticMessages: newState,
      messageTemplates: newState
    });
  };

  const selectOnlyBusinessData = () => {
    setResetOptions({
      appointments: true,
      clients: true,
      services: true,
      notifications: true,
      messageLogs: true,
      appearanceSettings: false,
      businessSettings: false,
      workingHours: false,
      automaticMessages: false,
      messageTemplates: false
    });
  };

  const selectOnlySettings = () => {
    setResetOptions({
      appointments: false,
      clients: false,
      services: false,
      notifications: false,
      messageLogs: false,
      appearanceSettings: true,
      businessSettings: true,
      workingHours: true,
      automaticMessages: true,
      messageTemplates: true
    });
  };

  const createBackup = () => {
    const backupData = {
      timestamp: new Date().toISOString(),
      data: {}
    };

    // Collect all localStorage data
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('mock') || key.includes('Settings') || key.includes('Messages') || key.includes('Hours')) {
        backupData.data[key] = localStorage.getItem(key);
      }
    });

    const dataStr = JSON.stringify(backupData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-completo-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const performReset = async () => {
    setIsResetting(true);

    try {
      // Create backup if requested
      if (backupBeforeReset) {
        createBackup();
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate backup time
      }

      // Perform reset based on type
      if (resetType === 'complete') {
        // Complete reset - clear everything
        localStorage.clear();
      } else if (resetType === 'partial') {
        // Partial reset - only selected items
        Object.entries(resetOptions).forEach(([key, shouldReset]) => {
          if (shouldReset) {
            const storageKeys = getStorageKeysForCategory(key as keyof ResetOptions);
            storageKeys.forEach(storageKey => {
              localStorage.removeItem(storageKey);
            });
          }
        });
      } else if (resetType === 'date-range') {
        // Date range reset - filter appointments by date
        resetAppointmentsByDateRange();
      }

      // Simulate reset process
      await new Promise(resolve => setTimeout(resolve, 2000));

      setIsResetting(false);
      setResetComplete(true);
      setShowConfirmDialog(false);

      // Auto-hide success message after 5 seconds
      setTimeout(() => {
        setResetComplete(false);
      }, 5000);

    } catch (error) {
      console.error('Reset failed:', error);
      setIsResetting(false);
    }
  };

  const getStorageKeysForCategory = (category: keyof ResetOptions): string[] => {
    const keyMap = {
      appointments: ['mockAppointments'],
      clients: ['mockClients'],
      services: ['mockServices'],
      notifications: ['systemNotifications'],
      messageLogs: ['messageLogs'],
      appearanceSettings: ['appearanceSettings'],
      businessSettings: ['businessSettings'],
      workingHours: ['workingHours'],
      automaticMessages: ['automaticMessages'],
      messageTemplates: ['messageTemplates']
    };

    return keyMap[category] || [];
  };

  const resetAppointmentsByDateRange = () => {
    if (!dateRange.start || !dateRange.end) return;

    const appointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]');
    const startDate = new Date(dateRange.start);
    const endDate = new Date(dateRange.end);

    const filteredAppointments = appointments.filter((apt: any) => {
      const aptDate = new Date(apt.date);
      return aptDate < startDate || aptDate > endDate;
    });

    localStorage.setItem('mockAppointments', JSON.stringify(filteredAppointments));
  };

  const getSelectedCount = () => {
    return Object.values(resetOptions).filter(Boolean).length;
  };

  const getTotalDataSize = () => {
    let totalSize = 0;
    Object.keys(localStorage).forEach(key => {
      totalSize += (localStorage.getItem(key) || '').length;
    });
    return (totalSize / 1024).toFixed(1) + ' KB';
  };

  const restoreFromBackup = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backupData = JSON.parse(e.target?.result as string);
          
          if (confirm('Tem certeza que deseja restaurar este backup? Todos os dados atuais serão substituídos.')) {
            // Clear current data
            localStorage.clear();
            
            // Restore backup data
            Object.entries(backupData.data).forEach(([key, value]) => {
              localStorage.setItem(key, value as string);
            });
            
            alert('Backup restaurado com sucesso! A página será recarregada.');
            window.location.reload();
          }
        } catch (error) {
          alert('Erro ao restaurar backup. Verifique se o arquivo é válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Gerenciamento de Dados</h3>
          <p className="text-sm text-gray-500">Reset de estatísticas, backup e restauração de dados</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <span className="text-sm text-gray-500">
            Tamanho total: {getTotalDataSize()}
          </span>
          <button
            onClick={createBackup}
            className="flex items-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4 mr-2" />
            Backup Completo
          </button>
        </div>
      </div>

      {/* Success Message */}
      {resetComplete && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
            <div>
              <p className="text-green-800 font-medium">Reset realizado com sucesso!</p>
              <p className="text-green-700 text-sm mt-1">
                Os dados selecionados foram removidos. {backupBeforeReset && 'Um backup foi criado automaticamente.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Reset Type Selection */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h4 className="font-medium text-gray-900 mb-4">Tipo de Reset</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div 
            onClick={() => setResetType('partial')}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              resetType === 'partial' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <Target className={`w-8 h-8 ${resetType === 'partial' ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <h5 className={`font-medium text-center ${resetType === 'partial' ? 'text-blue-900' : 'text-gray-900'}`}>
              Reset Seletivo
            </h5>
            <p className="text-sm text-gray-600 text-center mt-1">
              Escolha quais dados resetar
            </p>
          </div>

          <div 
            onClick={() => setResetType('date-range')}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              resetType === 'date-range' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <Calendar className={`w-8 h-8 ${resetType === 'date-range' ? 'text-blue-600' : 'text-gray-400'}`} />
            </div>
            <h5 className={`font-medium text-center ${resetType === 'date-range' ? 'text-blue-900' : 'text-gray-900'}`}>
              Reset por Período
            </h5>
            <p className="text-sm text-gray-600 text-center mt-1">
              Remove dados de um período específico
            </p>
          </div>

          <div 
            onClick={() => setResetType('complete')}
            className={`p-4 border rounded-lg cursor-pointer transition-colors ${
              resetType === 'complete' ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <div className="flex items-center justify-center mb-3">
              <RotateCcw className={`w-8 h-8 ${resetType === 'complete' ? 'text-red-600' : 'text-gray-400'}`} />
            </div>
            <h5 className={`font-medium text-center ${resetType === 'complete' ? 'text-red-900' : 'text-gray-900'}`}>
              Reset Completo
            </h5>
            <p className="text-sm text-gray-600 text-center mt-1">
              Remove todos os dados
            </p>
          </div>
        </div>

        {/* Date Range Selection */}
        {resetType === 'date-range' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <h5 className="font-medium text-blue-900 mb-3">Selecionar Período para Remoção</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Data Inicial</label>
                <input
                  type="date"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-blue-800 mb-2">Data Final</label>
                <input
                  type="date"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <p className="text-sm text-blue-700 mt-2">
              ⚠️ Agendamentos entre estas datas serão removidos permanentemente.
            </p>
          </div>
        )}

        {/* Data Selection for Partial Reset */}
        {resetType === 'partial' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h5 className="font-medium text-gray-900">Selecionar Dados para Reset</h5>
              <div className="flex space-x-2">
                <button
                  onClick={selectOnlyBusinessData}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
                >
                  Apenas Dados Comerciais
                </button>
                <button
                  onClick={selectOnlySettings}
                  className="px-3 py-1 text-sm bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 transition-colors"
                >
                  Apenas Configurações
                </button>
                <button
                  onClick={selectAllData}
                  className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {Object.values(resetOptions).every(v => v) ? 'Desmarcar Todos' : 'Selecionar Todos'}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {dataCategories.map((category) => {
                const Icon = category.icon;
                return (
                  <div
                    key={category.key}
                    className={`border rounded-lg p-4 transition-colors ${
                      resetOptions[category.key] 
                        ? `${colorClasses[category.color]} border-2` 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Icon className={`w-5 h-5 ${
                          resetOptions[category.key] 
                            ? iconColorClasses[category.color]
                            : 'text-gray-400'
                        }`} />
                        <div>
                          <h6 className={`font-medium ${
                            resetOptions[category.key] ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {category.name}
                          </h6>
                          <p className="text-sm text-gray-500">{category.description}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            {category.count} {category.count === 1 ? 'item' : 'itens'}
                          </p>
                        </div>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={resetOptions[category.key]}
                          onChange={(e) => handleResetOptionChange(category.key, e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                );
              })}
            </div>

            {getSelectedCount() > 0 && (
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>{getSelectedCount()}</strong> categoria{getSelectedCount() > 1 ? 's' : ''} selecionada{getSelectedCount() > 1 ? 's' : ''} para reset.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Backup Option */}
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="font-medium text-green-900">Criar Backup Antes do Reset</h5>
              <p className="text-sm text-green-700">Recomendado para segurança dos dados</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={backupBeforeReset}
                onChange={(e) => setBackupBeforeReset(e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>
        </div>

        {/* Reset Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setShowConfirmDialog(true)}
            disabled={resetType === 'partial' && getSelectedCount() === 0}
            className={`flex items-center px-6 py-3 rounded-md font-medium transition-colors ${
              resetType === 'complete'
                ? 'bg-red-600 hover:bg-red-700 text-white'
                : resetType === 'partial' && getSelectedCount() === 0
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-600 hover:bg-orange-700 text-white'
            }`}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {resetType === 'complete' ? 'Reset Completo' : 
             resetType === 'date-range' ? 'Reset por Período' : 
             'Reset Seletivo'}
          </button>
        </div>
      </div>

      {/* Backups Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-900">Backups Disponíveis</h4>
          <label className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer">
            <Upload className="w-4 h-4 mr-2" />
            Restaurar Backup
            <input
              type="file"
              accept=".json"
              onChange={restoreFromBackup}
              className="hidden"
            />
          </label>
        </div>

        <div className="space-y-3">
          {backups.map((backup) => (
            <div key={backup.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Archive className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h5 className="font-medium text-gray-900">{backup.name}</h5>
                  <p className="text-sm text-gray-500">
                    {backup.date.toLocaleDateString('pt-BR')} • {backup.size} • {backup.items.join(', ')}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors">
                  Restaurar
                </button>
                <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors">
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="modal-overlay" data-modal-active="true">
          <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Confirmar Reset</h3>
                  <p className="text-sm text-gray-500">Esta ação não pode ser desfeita</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="mb-6">
                {resetType === 'complete' && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-medium mb-2">⚠️ Reset Completo</p>
                    <p className="text-red-700 text-sm">
                      Todos os dados do sistema serão removidos permanentemente, incluindo:
                    </p>
                    <ul className="text-red-700 text-sm mt-2 list-disc list-inside">
                      <li>Todos os agendamentos e histórico</li>
                      <li>Base completa de clientes</li>
                      <li>Catálogo de serviços</li>
                      <li>Todas as configurações</li>
                      <li>Notificações e logs</li>
                    </ul>
                  </div>
                )}

                {resetType === 'partial' && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <p className="text-orange-800 font-medium mb-2">Reset Seletivo</p>
                    <p className="text-orange-700 text-sm mb-2">
                      Os seguintes dados serão removidos:
                    </p>
                    <ul className="text-orange-700 text-sm list-disc list-inside">
                      {Object.entries(resetOptions)
                        .filter(([_, selected]) => selected)
                        .map(([key, _]) => {
                          const category = dataCategories.find(c => c.key === key);
                          return <li key={key}>{category?.name}</li>;
                        })}
                    </ul>
                  </div>
                )}

                {resetType === 'date-range' && (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-blue-800 font-medium mb-2">Reset por Período</p>
                    <p className="text-blue-700 text-sm">
                      Agendamentos entre <strong>{new Date(dateRange.start).toLocaleDateString('pt-BR')}</strong> e{' '}
                      <strong>{new Date(dateRange.end).toLocaleDateString('pt-BR')}</strong> serão removidos.
                    </p>
                  </div>
                )}

                {backupBeforeReset && (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
                      <p className="text-green-800 text-sm">
                        Um backup será criado automaticamente antes do reset.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isResetting}
                  className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={performReset}
                  disabled={isResetting}
                  className="flex-1 flex items-center justify-center px-4 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                >
                  {isResetting ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Resetando...
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 mr-2" />
                      Confirmar Reset
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}