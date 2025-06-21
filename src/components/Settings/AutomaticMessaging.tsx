import React, { useState } from 'react';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Clock, 
  Calendar, 
  Save, 
  Plus, 
  Trash2, 
  Edit3,
  Check,
  AlertCircle,
  Eye,
  Copy
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface MessageTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  variables: string[];
}

interface AutomaticMessage {
  id: string;
  name: string;
  type: 'whatsapp' | 'sms' | 'email';
  trigger: 'before_appointment' | 'day_of_appointment' | 'after_appointment';
  timing: number; // minutes before/after
  enabled: boolean;
  template: MessageTemplate;
}

interface MessagingSettings {
  whatsappEnabled: boolean;
  whatsappApiKey: string;
  whatsappNumber: string;
  smsEnabled: boolean;
  smsApiKey: string;
  smsProvider: 'twilio' | 'nexmo' | 'custom';
  emailEnabled: boolean;
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun';
  emailConfig: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

const defaultTemplates: MessageTemplate[] = [
  {
    id: '1',
    name: 'Lembrete WhatsApp - 24h antes',
    content: `Olá {{clientName}}! 👋

Lembramos que você tem um agendamento marcado para amanhã:

📅 **{{appointmentDate}}** às **{{appointmentTime}}**
✂️ **Serviço:** {{serviceName}}
⏱️ **Duração:** {{serviceDuration}} minutos
💰 **Valor:** R$ {{servicePrice}}

📍 **Local:** {{businessAddress}}

Se precisar reagendar ou cancelar, entre em contato conosco.

Aguardamos você! 😊`,
    variables: ['clientName', 'appointmentDate', 'appointmentTime', 'serviceName', 'serviceDuration', 'servicePrice', 'businessAddress']
  },
  {
    id: '2',
    name: 'Lembrete SMS - 2h antes',
    content: 'Oi {{clientName}}! Lembrete: seu agendamento de {{serviceName}} é hoje às {{appointmentTime}}. Local: {{businessAddress}}. Dúvidas? Ligue {{businessPhone}}',
    variables: ['clientName', 'serviceName', 'appointmentTime', 'businessAddress', 'businessPhone']
  },
  {
    id: '3',
    name: 'Confirmação Email',
    subject: 'Confirmação de Agendamento - {{businessName}}',
    content: `Olá {{clientName}},

Seu agendamento foi confirmado com sucesso!

**Detalhes do Agendamento:**
- Data: {{appointmentDate}}
- Horário: {{appointmentTime}}
- Serviço: {{serviceName}}
- Duração: {{serviceDuration}} minutos
- Valor: R$ {{servicePrice}}

**Local:**
{{businessName}}
{{businessAddress}}
Telefone: {{businessPhone}}

**Observações:**
{{appointmentNotes}}

Caso precise cancelar ou reagendar, entre em contato conosco com pelo menos 24 horas de antecedência.

Atenciosamente,
Equipe {{businessName}}`,
    variables: ['clientName', 'appointmentDate', 'appointmentTime', 'serviceName', 'serviceDuration', 'servicePrice', 'businessName', 'businessAddress', 'businessPhone', 'appointmentNotes']
  }
];

const defaultMessages: AutomaticMessage[] = [
  {
    id: '1',
    name: 'Lembrete WhatsApp 24h antes',
    type: 'whatsapp',
    trigger: 'before_appointment',
    timing: 1440, // 24 hours in minutes
    enabled: true,
    template: defaultTemplates[0]
  },
  {
    id: '2',
    name: 'Lembrete SMS 2h antes',
    type: 'sms',
    trigger: 'before_appointment',
    timing: 120, // 2 hours in minutes
    enabled: false,
    template: defaultTemplates[1]
  },
  {
    id: '3',
    name: 'Confirmação por Email',
    type: 'email',
    trigger: 'day_of_appointment',
    timing: 0,
    enabled: true,
    template: defaultTemplates[2]
  }
];

export default function AutomaticMessaging() {
  const [messagingSettings, setMessagingSettings] = useLocalStorage<MessagingSettings>('messagingSettings', {
    whatsappEnabled: false,
    whatsappApiKey: '',
    whatsappNumber: '',
    smsEnabled: false,
    smsApiKey: '',
    smsProvider: 'twilio',
    emailEnabled: true,
    emailProvider: 'smtp',
    emailConfig: {}
  });

  const [automaticMessages, setAutomaticMessages] = useLocalStorage<AutomaticMessage[]>('automaticMessages', defaultMessages);
  const [templates, setTemplates] = useLocalStorage<MessageTemplate[]>('messageTemplates', defaultTemplates);

  const [activeTab, setActiveTab] = useState<'settings' | 'messages' | 'templates'>('settings');
  const [editingMessage, setEditingMessage] = useState<AutomaticMessage | null>(null);
  const [editingTemplate, setEditingTemplate] = useState<MessageTemplate | null>(null);
  const [previewMessage, setPreviewMessage] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);

  const availableVariables = [
    'clientName', 'clientEmail', 'clientPhone',
    'appointmentDate', 'appointmentTime', 'appointmentNotes',
    'serviceName', 'serviceDuration', 'servicePrice',
    'businessName', 'businessAddress', 'businessPhone'
  ];

  const updateMessagingSettings = (field: keyof MessagingSettings, value: any) => {
    setMessagingSettings(prev => ({ ...prev, [field]: value }));
  };

  const updateEmailConfig = (field: string, value: any) => {
    setMessagingSettings(prev => ({
      ...prev,
      emailConfig: { ...prev.emailConfig, [field]: value }
    }));
  };

  const toggleMessage = (id: string) => {
    setAutomaticMessages(prev => prev.map(msg => 
      msg.id === id ? { ...msg, enabled: !msg.enabled } : msg
    ));
  };

  const deleteMessage = (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta mensagem automática?')) {
      setAutomaticMessages(prev => prev.filter(msg => msg.id !== id));
    }
  };

  const saveMessage = (message: AutomaticMessage) => {
    if (editingMessage) {
      setAutomaticMessages(prev => prev.map(msg => 
        msg.id === editingMessage.id ? message : msg
      ));
    } else {
      setAutomaticMessages(prev => [...prev, { ...message, id: Date.now().toString() }]);
    }
    setEditingMessage(null);
  };

  const saveTemplate = (template: MessageTemplate) => {
    if (editingTemplate) {
      setTemplates(prev => prev.map(tmpl => 
        tmpl.id === editingTemplate.id ? template : tmpl
      ));
    } else {
      setTemplates(prev => [...prev, { ...template, id: Date.now().toString() }]);
    }
    setEditingTemplate(null);
  };

  const previewMessageWithData = (content: string) => {
    const sampleData = {
      clientName: 'Ana Silva',
      clientEmail: 'ana.silva@email.com',
      clientPhone: '(11) 99999-1111',
      appointmentDate: '25/12/2024',
      appointmentTime: '14:00',
      appointmentNotes: 'Cliente preferencial',
      serviceName: 'Corte Feminino',
      serviceDuration: '45',
      servicePrice: '50,00',
      businessName: 'Salão Belle Époque',
      businessAddress: 'Rua das Flores, 123 - Centro, São Paulo - SP',
      businessPhone: '(11) 3333-4444'
    };

    let preview = content;
    Object.entries(sampleData).forEach(([key, value]) => {
      preview = preview.replace(new RegExp(`{{${key}}}`, 'g'), value);
    });

    return preview;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getTimingLabel = (timing: number, trigger: string) => {
    if (trigger === 'day_of_appointment' && timing === 0) return 'No momento do agendamento';
    
    const hours = Math.floor(timing / 60);
    const minutes = timing % 60;
    
    let label = '';
    if (hours > 0) label += `${hours}h `;
    if (minutes > 0) label += `${minutes}min `;
    
    return trigger === 'before_appointment' ? `${label}antes` : `${label}depois`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Mensagens Automáticas</h3>
          <p className="text-sm text-gray-500">Configure lembretes e confirmações automáticas para seus clientes</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'settings', name: 'Configurações', icon: MessageSquare },
            { id: 'messages', name: 'Mensagens Automáticas', icon: Clock },
            { id: 'templates', name: 'Modelos', icon: Edit3 }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-6">
          {/* WhatsApp Settings */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <MessageSquare className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h4 className="font-medium text-green-900">WhatsApp Business API</h4>
                  <p className="text-sm text-green-700">Envie mensagens via WhatsApp Business</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={messagingSettings.whatsappEnabled}
                  onChange={(e) => updateMessagingSettings('whatsappEnabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>
            
            {messagingSettings.whatsappEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">API Key</label>
                  <input
                    type="password"
                    value={messagingSettings.whatsappApiKey}
                    onChange={(e) => updateMessagingSettings('whatsappApiKey', e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="Sua chave da API do WhatsApp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-green-800 mb-2">Número do WhatsApp</label>
                  <input
                    type="tel"
                    value={messagingSettings.whatsappNumber}
                    onChange={(e) => updateMessagingSettings('whatsappNumber', e.target.value)}
                    className="w-full px-3 py-2 border border-green-300 rounded-md focus:outline-none focus:ring-1 focus:ring-green-500 focus:border-green-500"
                    placeholder="+55 11 99999-9999"
                  />
                </div>
              </div>
            )}
          </div>

          {/* SMS Settings */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Smartphone className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium text-blue-900">SMS</h4>
                  <p className="text-sm text-blue-700">Envie mensagens de texto via SMS</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={messagingSettings.smsEnabled}
                  onChange={(e) => updateMessagingSettings('smsEnabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
            
            {messagingSettings.smsEnabled && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">Provedor SMS</label>
                  <select
                    value={messagingSettings.smsProvider}
                    onChange={(e) => updateMessagingSettings('smsProvider', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="twilio">Twilio</option>
                    <option value="nexmo">Vonage (Nexmo)</option>
                    <option value="custom">Personalizado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-blue-800 mb-2">API Key</label>
                  <input
                    type="password"
                    value={messagingSettings.smsApiKey}
                    onChange={(e) => updateMessagingSettings('smsApiKey', e.target.value)}
                    className="w-full px-3 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Sua chave da API SMS"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Email Settings */}
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h4 className="font-medium text-purple-900">Email</h4>
                  <p className="text-sm text-purple-700">Envie emails automáticos para clientes</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={messagingSettings.emailEnabled}
                  onChange={(e) => updateMessagingSettings('emailEnabled', e.target.checked)}
                  className="sr-only peer" 
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>
            
            {messagingSettings.emailEnabled && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-purple-800 mb-2">Provedor de Email</label>
                  <select
                    value={messagingSettings.emailProvider}
                    onChange={(e) => updateMessagingSettings('emailProvider', e.target.value)}
                    className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                  >
                    <option value="smtp">SMTP</option>
                    <option value="sendgrid">SendGrid</option>
                    <option value="mailgun">Mailgun</option>
                  </select>
                </div>
                
                {messagingSettings.emailProvider === 'smtp' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Servidor SMTP</label>
                      <input
                        type="text"
                        value={messagingSettings.emailConfig.host || ''}
                        onChange={(e) => updateEmailConfig('host', e.target.value)}
                        className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="smtp.gmail.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Porta</label>
                      <input
                        type="number"
                        value={messagingSettings.emailConfig.port || ''}
                        onChange={(e) => updateEmailConfig('port', parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="587"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Usuário</label>
                      <input
                        type="email"
                        value={messagingSettings.emailConfig.username || ''}
                        onChange={(e) => updateEmailConfig('username', e.target.value)}
                        className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="seu@email.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-purple-800 mb-2">Senha</label>
                      <input
                        type="password"
                        value={messagingSettings.emailConfig.password || ''}
                        onChange={(e) => updateEmailConfig('password', e.target.value)}
                        className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                        placeholder="Sua senha de email"
                      />
                    </div>
                  </div>
                )}
                
                {(messagingSettings.emailProvider === 'sendgrid' || messagingSettings.emailProvider === 'mailgun') && (
                  <div>
                    <label className="block text-sm font-medium text-purple-800 mb-2">API Key</label>
                    <input
                      type="password"
                      value={messagingSettings.emailConfig.apiKey || ''}
                      onChange={(e) => updateEmailConfig('apiKey', e.target.value)}
                      className="w-full px-3 py-2 border border-purple-300 rounded-md focus:outline-none focus:ring-1 focus:ring-purple-500 focus:border-purple-500"
                      placeholder="Sua chave da API"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Messages Tab */}
      {activeTab === 'messages' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Mensagens Automáticas Configuradas</h4>
            <button
              onClick={() => setEditingMessage({
                id: '',
                name: '',
                type: 'whatsapp',
                trigger: 'before_appointment',
                timing: 60,
                enabled: true,
                template: templates[0]
              })}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nova Mensagem
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {automaticMessages.map((message) => (
              <div key={message.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      message.type === 'whatsapp' ? 'bg-green-100' :
                      message.type === 'sms' ? 'bg-blue-100' : 'bg-purple-100'
                    }`}>
                      {message.type === 'whatsapp' && <MessageSquare className="w-5 h-5 text-green-600" />}
                      {message.type === 'sms' && <Smartphone className="w-5 h-5 text-blue-600" />}
                      {message.type === 'email' && <Mail className="w-5 h-5 text-purple-600" />}
                    </div>
                    <div>
                      <h5 className="font-medium text-gray-900">{message.name}</h5>
                      <p className="text-sm text-gray-500">
                        {message.type.toUpperCase()} • {getTimingLabel(message.timing, message.trigger)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={message.enabled}
                        onChange={() => toggleMessage(message.id)}
                        className="sr-only peer" 
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                    
                    <button
                      onClick={() => {
                        setPreviewMessage(previewMessageWithData(message.template.content));
                        setShowPreview(true);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Visualizar mensagem"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setEditingMessage(message)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar mensagem"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => deleteMessage(message.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Excluir mensagem"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700 line-clamp-3">{message.template.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h4 className="font-medium text-gray-900">Modelos de Mensagem</h4>
            <button
              onClick={() => setEditingTemplate({
                id: '',
                name: '',
                content: '',
                variables: []
              })}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Novo Modelo
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {templates.map((template) => (
              <div key={template.id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h5 className="font-medium text-gray-900">{template.name}</h5>
                    <p className="text-sm text-gray-500">
                      {template.variables.length} variáveis disponíveis
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => copyToClipboard(template.content)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Copiar modelo"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => setEditingTemplate(template)}
                      className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Editar modelo"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <p className="text-sm text-gray-700 whitespace-pre-wrap line-clamp-4">{template.content}</p>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.variables.map((variable) => (
                    <span key={variable} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      {`{{${variable}}}`}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {showPreview && (
        <div className="modal-overlay" data-modal-active="true">
          <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Visualização da Mensagem</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{previewMessage}</p>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-xs text-blue-800">
                  <strong>Nota:</strong> Esta é uma visualização com dados de exemplo. 
                  As variáveis serão substituídas pelos dados reais do agendamento.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}