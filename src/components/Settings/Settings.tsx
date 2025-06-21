import React, { useState } from 'react';
import { Save, User, Building, Clock, Bell, Palette, Shield, Check, AlertCircle, MessageSquare, Database, Star, Upload, Calendar } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import AutomaticMessaging from './AutomaticMessaging';
import AppearanceSettings from './AppearanceSettings';
import DataManagement from './DataManagement';
import ReviewsSection from '../Reviews/ReviewsSection';

interface BusinessSettings {
  name: string;
  brandName: string;
  brandLogo?: string;
  phone: string;
  address: string;
  description: string;
}

interface WorkingHours {
  [key: string]: {
    enabled: boolean;
    start: string;
    end: string;
    isCustom: boolean;
    customMessage: string;
  };
}

interface NotificationSettings {
  appointmentReminder: boolean;
  confirmationEmail: boolean;
  smsNotifications: boolean;
  emailReports: boolean;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

interface SecuritySettings {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState('business');
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState('');
  
  // Persistent settings using localStorage
  const [businessSettings, setBusinessSettings] = useLocalStorage<BusinessSettings>('businessSettings', {
    name: 'Salão Belle Époque',
    brandName: 'AgendaPro',
    brandLogo: '',
    phone: '(11) 3333-4444',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    description: 'Salão de beleza especializado em cortes modernos e tratamentos capilares.'
  });

  const [workingHours, setWorkingHours] = useLocalStorage<WorkingHours>('workingHours', {
    monday: { enabled: true, start: '09:00', end: '18:00', isCustom: false, customMessage: '' },
    tuesday: { enabled: true, start: '09:00', end: '18:00', isCustom: false, customMessage: '' },
    wednesday: { enabled: true, start: '09:00', end: '18:00', isCustom: false, customMessage: '' },
    thursday: { enabled: true, start: '09:00', end: '18:00', isCustom: false, customMessage: '' },
    friday: { enabled: true, start: '09:00', end: '18:00', isCustom: false, customMessage: '' },
    saturday: { enabled: true, start: '09:00', end: '16:00', isCustom: false, customMessage: '' },
    sunday: { enabled: false, start: '09:00', end: '18:00', isCustom: true, customMessage: 'À consultar' }
  });

  const [notifications, setNotifications] = useLocalStorage<NotificationSettings>('notificationSettings', {
    appointmentReminder: true,
    confirmationEmail: true,
    smsNotifications: false,
    emailReports: true
  });

  const [userProfile, setUserProfile] = useLocalStorage<UserProfile>('userProfile', {
    name: 'João Silva',
    email: 'joao@email.com'
  });

  // Local state for security (passwords should not be persisted)
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const tabs = [
    { id: 'business', name: 'Negócio', icon: Building },
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'schedule', name: 'Horários', icon: Clock },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'messaging', name: 'Mensagens Automáticas', icon: MessageSquare },
    { id: 'reviews', name: 'Avaliações', icon: Star },
    { id: 'appearance', name: 'Aparência', icon: Palette },
    { id: 'data', name: 'Gerenciar Dados', icon: Database },
    { id: 'security', name: 'Segurança', icon: Shield },
  ];

  const dayNames = {
    monday: 'Segunda-feira',
    tuesday: 'Terça-feira',
    wednesday: 'Quarta-feira',
    thursday: 'Quinta-feira',
    friday: 'Sexta-feira',
    saturday: 'Sábado',
    sunday: 'Domingo'
  };

  const customMessageOptions = [
    'À consultar',
    'Sob agendamento',
    'Horário especial',
    'Apenas emergências',
    'Fechado para manutenção',
    'Horário de verão',
    'Horário de inverno'
  ];

  const handleSave = () => {
    try {
      setSaveError('');
      
      // Validate business settings
      if (!businessSettings.name.trim()) {
        throw new Error('Nome do negócio é obrigatório');
      }
      if (!businessSettings.phone.trim()) {
        throw new Error('Telefone é obrigatório');
      }
      if (!userProfile.name.trim()) {
        throw new Error('Nome do usuário é obrigatório');
      }
      if (!userProfile.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userProfile.email)) {
        throw new Error('Email válido é obrigatório');
      }

      // Validate security settings if passwords are provided
      if (securitySettings.newPassword) {
        if (!securitySettings.currentPassword) {
          throw new Error('Senha atual é obrigatória para alterar a senha');
        }
        if (securitySettings.newPassword !== securitySettings.confirmPassword) {
          throw new Error('Nova senha e confirmação não coincidem');
        }
        if (securitySettings.newPassword.length < 6) {
          throw new Error('Nova senha deve ter pelo menos 6 caracteres');
        }
      }

      // All settings are automatically saved via useLocalStorage hooks
      // Here we could also send to a backend API if needed
      
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Clear password fields after successful save
      if (securitySettings.newPassword) {
        setSecuritySettings({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
      // Trigger custom events to notify other components about changes
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
        detail: userProfile 
      }));
      
      window.dispatchEvent(new CustomEvent('businessSettingsUpdated', { 
        detail: businessSettings 
      }));
      
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Erro ao salvar configurações');
      setTimeout(() => setSaveError(''), 5000);
    }
  };

  const updateBusinessSettings = (field: keyof BusinessSettings, value: string) => {
    setBusinessSettings(prev => ({ ...prev, [field]: value }));
    
    // Trigger immediate update for real-time preview
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent('businessSettingsUpdated', { 
        detail: { ...businessSettings, [field]: value }
      }));
    }, 0);
  };

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Verificar se é uma imagem
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem (JPG, PNG, SVG).');
        return;
      }

      // Verificar tamanho (máx 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setBusinessSettings(prev => ({ ...prev, brandLogo: result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setBusinessSettings(prev => ({ ...prev, brandLogo: '' }));
  };

  const updateWorkingHours = (day: string, field: string, value: string | boolean) => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: { ...prev[day], [field]: value }
    }));
  };

  const updateNotifications = (field: keyof NotificationSettings, value: boolean) => {
    setNotifications(prev => ({ ...prev, [field]: value }));
  };

  const updateUserProfile = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const updateSecuritySettings = (field: keyof SecuritySettings, value: string) => {
    setSecuritySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleScheduleTypeChange = (day: string, type: 'normal' | 'custom' | 'closed') => {
    setWorkingHours(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        enabled: type !== 'closed',
        isCustom: type === 'custom',
        customMessage: type === 'custom' ? 'À consultar' : ''
      }
    }));
  };

  const resetToDefaults = () => {
    if (confirm('Tem certeza que deseja restaurar todas as configurações para os valores padrão? Esta ação não pode ser desfeita.')) {
      // Clear localStorage
      localStorage.removeItem('businessSettings');
      localStorage.removeItem('workingHours');
      localStorage.removeItem('notificationSettings');
      localStorage.removeItem('userProfile');
      localStorage.removeItem('appearanceSettings');
      localStorage.removeItem('messagingSettings');
      localStorage.removeItem('automaticMessages');
      localStorage.removeItem('messageTemplates');
      
      // Reload page to reset all states
      window.location.reload();
    }
  };

  // Função para obter as iniciais do nome
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Configurações</h1>
          <p className="text-gray-600">Gerencie as configurações do seu negócio</p>
        </div>
        
        {activeTab !== 'appearance' && activeTab !== 'data' && activeTab !== 'reviews' && (
          <div className="flex items-center space-x-3">
            <button 
              onClick={resetToDefaults}
              className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Restaurar Padrões
            </button>
            
            <button 
              onClick={handleSave}
              disabled={saved}
              className={`flex items-center px-4 py-2 rounded-md transition-all ${
                saved 
                  ? 'bg-green-600 text-white' 
                  : saveError
                  ? 'bg-red-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Salvo!
                </>
              ) : saveError ? (
                <>
                  <AlertCircle className="w-4 h-4 mr-2" />
                  Erro
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Error Message */}
      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <p className="text-red-800 font-medium">Erro ao salvar:</p>
          </div>
          <p className="text-red-700 mt-1">{saveError}</p>
        </div>
      )}

      {/* Success Message */}
      {saved && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center">
            <Check className="w-5 h-5 text-green-600 mr-2" />
            <p className="text-green-800 font-medium">Configurações salvas com sucesso!</p>
          </div>
          <p className="text-green-700 mt-1">Todas as alterações foram aplicadas automaticamente.</p>
        </div>
      )}
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar */}
        <div className="lg:w-64">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-left rounded-md transition-colors
                    ${activeTab === tab.id
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1">
          {activeTab === 'appearance' ? (
            <AppearanceSettings />
          ) : activeTab === 'data' ? (
            <DataManagement />
          ) : activeTab === 'reviews' ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <ReviewsSection />
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
              {activeTab === 'business' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Informações do Negócio</h3>
                  
                  {/* Brand Section */}
                  <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-4">Identidade Visual</h4>
                    <p className="text-sm text-blue-700 mb-6">Configure como sua marca aparece no sistema</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">
                          Nome da Marca *
                        </label>
                        <input
                          type="text"
                          value={businessSettings.brandName}
                          onChange={(e) => updateBusinessSettings('brandName', e.target.value)}
                          className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Ex: AgendaPro, MeuSalão..."
                        />
                        <p className="text-xs text-blue-600 mt-1">Este nome aparecerá na barra lateral</p>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-blue-800 mb-2">
                          Logo da Marca
                        </label>
                        <div className="space-y-3">
                          {businessSettings.brandLogo ? (
                            <div className="flex items-center space-x-4">
                              <div className="w-16 h-16 bg-white rounded-lg border border-blue-300 flex items-center justify-center overflow-hidden">
                                <img 
                                  src={businessSettings.brandLogo} 
                                  alt="Logo da marca"
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <label className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors cursor-pointer text-sm">
                                  Alterar
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoUpload}
                                    className="hidden"
                                  />
                                </label>
                                <button 
                                  type="button"
                                  onClick={removeLogo}
                                  className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm"
                                >
                                  Remover
                                </button>
                              </div>
                            </div>
                          ) : (
                            <label className="flex items-center justify-center w-full h-12 border-2 border-blue-300 border-dashed rounded-lg cursor-pointer hover:bg-blue-50 transition-colors">
                              <div className="text-center">
                                <Upload className="w-5 h-5 text-blue-500 mx-auto mb-1" />
                                <span className="text-sm text-blue-600">Enviar logo</span>
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handleLogoUpload}
                                className="hidden"
                              />
                            </label>
                          )}
                          <p className="text-xs text-blue-600">
                            JPG, PNG ou SVG até 2MB. Recomendado: 512x512px
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Preview */}
                    <div className="mt-6 p-4 bg-white border border-blue-200 rounded-lg">
                      <h5 className="text-sm font-medium text-blue-900 mb-3">Prévia na Barra Lateral:</h5>
                      <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md">
                        <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
                          {businessSettings.brandLogo ? (
                            <img 
                              src={businessSettings.brandLogo} 
                              alt="Logo preview"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Calendar className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <span className="text-xl font-bold text-gray-900">
                          {businessSettings.brandName || 'Nome da Marca'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome do Negócio *
                        </label>
                        <input
                          type="text"
                          value={businessSettings.name}
                          onChange={(e) => updateBusinessSettings('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Nome do seu negócio"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Telefone *
                        </label>
                        <input
                          type="tel"
                          value={businessSettings.phone}
                          onChange={(e) => updateBusinessSettings('phone', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="(11) 99999-9999"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Endereço
                      </label>
                      <input
                        type="text"
                        value={businessSettings.address}
                        onChange={(e) => updateBusinessSettings('address', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Endereço completo"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Descrição
                      </label>
                      <textarea
                        rows={4}
                        value={businessSettings.description}
                        onChange={(e) => updateBusinessSettings('description', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Descreva seu negócio..."
                      />
                    </div>
                  </div>
                </div>
              )}
              
              {activeTab === 'schedule' && (
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">Horários de Funcionamento</h3>
                      <p className="text-sm text-gray-500 mt-1">Configure os horários de atendimento para cada dia da semana</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-100 border border-green-300 rounded mr-2"></div>
                          <span>Horário normal</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-yellow-100 border border-yellow-300 rounded mr-2"></div>
                          <span>Horário especial</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-red-100 border border-red-300 rounded mr-2"></div>
                          <span>Fechado</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-6">
                    {Object.entries(workingHours).map(([day, hours]) => (
                      <div key={day} className={`p-4 border rounded-lg transition-colors ${
                        !hours.enabled ? 'bg-red-50 border-red-200' : 
                        hours.isCustom ? 'bg-yellow-50 border-yellow-200' : 
                        'bg-green-50 border-green-200'
                      }`}>
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-medium text-gray-900">
                            {dayNames[day as keyof typeof dayNames]}
                          </h4>
                          
                          <div className="flex items-center space-x-2">
                            <select
                              value={!hours.enabled ? 'closed' : hours.isCustom ? 'custom' : 'normal'}
                              onChange={(e) => handleScheduleTypeChange(day, e.target.value as 'normal' | 'custom' | 'closed')}
                              className="px-3 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            >
                              <option value="normal">Horário Normal</option>
                              <option value="custom">Horário Especial</option>
                              <option value="closed">Fechado</option>
                            </select>
                          </div>
                        </div>
                        
                        {hours.enabled && !hours.isCustom && (
                          <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-600">De:</label>
                              <input
                                type="time"
                                value={hours.start}
                                onChange={(e) => updateWorkingHours(day, 'start', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                            <div className="flex items-center space-x-2">
                              <label className="text-sm text-gray-600">Até:</label>
                              <input
                                type="time"
                                value={hours.end}
                                onChange={(e) => updateWorkingHours(day, 'end', e.target.value)}
                                className="px-2 py-1 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}
                        
                        {hours.enabled && hours.isCustom && (
                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Mensagem personalizada:
                              </label>
                              <div className="flex space-x-2">
                                <select
                                  value={customMessageOptions.includes(hours.customMessage) ? hours.customMessage : ''}
                                  onChange={(e) => updateWorkingHours(day, 'customMessage', e.target.value)}
                                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                >
                                  <option value="">Mensagem personalizada...</option>
                                  {customMessageOptions.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                                <button
                                  type="button"
                                  onClick={() => updateWorkingHours(day, 'customMessage', '')}
                                  className="px-3 py-2 text-gray-500 hover:text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                                  title="Limpar mensagem"
                                >
                                  Limpar
                                </button>
                              </div>
                            </div>
                            
                            {!customMessageOptions.includes(hours.customMessage) && (
                              <div>
                                <input
                                  type="text"
                                  value={hours.customMessage}
                                  onChange={(e) => updateWorkingHours(day, 'customMessage', e.target.value)}
                                  placeholder="Digite uma mensagem personalizada..."
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            )}
                            
                            <div className="bg-white p-3 rounded border border-yellow-300">
                              <p className="text-sm text-gray-700">
                                <strong>Visualização:</strong> {hours.customMessage || 'Digite uma mensagem personalizada'}
                              </p>
                            </div>
                          </div>
                        )}
                        
                        {!hours.enabled && (
                          <div className="text-center py-2">
                            <p className="text-sm text-red-600 font-medium">Fechado</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">💡 Dicas para horários especiais:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Use "À consultar" para dias com horários flexíveis</li>
                      <li>• "Sob agendamento" para atendimentos especiais</li>
                      <li>• "Apenas emergências" para plantões</li>
                      <li>• Personalize mensagens para feriados ou eventos especiais</li>
                    </ul>
                  </div>
                </div>
              )}
              
              {activeTab === 'notifications' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Configurações de Notificação</h3>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Lembrete de Agendamento</h4>
                        <p className="text-sm text-gray-500">Enviar lembretes aos clientes antes do agendamento</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.appointmentReminder}
                          onChange={(e) => updateNotifications('appointmentReminder', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email de Confirmação</h4>
                        <p className="text-sm text-gray-500">Enviar emails de confirmação após agendamento</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.confirmationEmail}
                          onChange={(e) => updateNotifications('confirmationEmail', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Notificações SMS</h4>
                        <p className="text-sm text-gray-500">Enviar SMS para clientes sobre agendamentos</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.smsNotifications}
                          onChange={(e) => updateNotifications('smsNotifications', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Relatórios por Email</h4>
                        <p className="text-sm text-gray-500">Receber relatórios semanais por email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          checked={notifications.emailReports}
                          onChange={(e) => updateNotifications('emailReports', e.target.checked)}
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'messaging' && (
                <div className="p-6">
                  <AutomaticMessaging />
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Perfil do Usuário</h3>
                  <div className="space-y-6">
                    <div className="flex items-center space-x-6">
                      <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        {userProfile.avatar ? (
                          <img 
                            src={userProfile.avatar} 
                            alt={userProfile.name}
                            className="w-20 h-20 rounded-full object-cover"
                          />
                        ) : (
                          <span className="text-blue-600 font-bold text-2xl">
                            {getInitials(userProfile.name)}
                          </span>
                        )}
                      </div>
                      <div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                          Alterar Foto
                        </button>
                        <p className="text-sm text-gray-500 mt-1">JPG, PNG até 2MB</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Nome *</label>
                        <input
                          type="text"
                          value={userProfile.name}
                          onChange={(e) => updateUserProfile('name', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="Seu nome completo"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                        <input
                          type="email"
                          value={userProfile.email}
                          onChange={(e) => updateUserProfile('email', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          placeholder="seu@email.com"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center">
                        <User className="w-5 h-5 text-blue-600 mr-2" />
                        <p className="text-blue-800 font-medium">Visualização do Perfil</p>
                      </div>
                      <div className="mt-3 flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-sm">
                            {getInitials(userProfile.name)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-blue-900">{userProfile.name}</p>
                          <p className="text-xs text-blue-700">Administrador</p>
                        </div>
                      </div>
                      <p className="text-xs text-blue-700 mt-2">
                        Assim seu perfil aparecerá no header do sistema
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-6">Segurança</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-4">Alterar Senha</h4>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Senha Atual</label>
                          <input
                            type="password"
                            value={securitySettings.currentPassword}
                            onChange={(e) => updateSecuritySettings('currentPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Digite sua senha atual"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Nova Senha</label>
                          <input
                            type="password"
                            value={securitySettings.newPassword}
                            onChange={(e) => updateSecuritySettings('newPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Digite a nova senha (mín. 6 caracteres)"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirmar Nova Senha</label>
                          <input
                            type="password"
                            value={securitySettings.confirmPassword}
                            onChange={(e) => updateSecuritySettings('confirmPassword', e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Confirme a nova senha"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}