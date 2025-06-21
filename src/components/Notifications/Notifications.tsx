import React, { useState } from 'react';
import { Bell, Check, CheckCheck, Trash2, Filter, Calendar, Users, Briefcase, AlertCircle, Info, Star, Clock } from 'lucide-react';

interface Notification {
  id: string;
  type: 'appointment' | 'reminder' | 'client' | 'system' | 'review' | 'payment';
  title: string;
  message: string;
  time: Date;
  read: boolean;
  priority: 'low' | 'medium' | 'high';
  actionUrl?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'appointment',
    title: 'Novo agendamento',
    message: 'Ana Silva agendou um Corte Feminino para amanhã às 14:00',
    time: new Date(Date.now() - 5 * 60 * 1000),
    read: false,
    priority: 'high'
  },
  {
    id: '2',
    type: 'reminder',
    title: 'Lembrete de agendamento',
    message: 'Você tem 3 agendamentos hoje. Primeiro às 09:00 com Carlos Santos',
    time: new Date(Date.now() - 60 * 60 * 1000),
    read: false,
    priority: 'medium'
  },
  {
    id: '3',
    type: 'client',
    title: 'Novo cliente cadastrado',
    message: 'Pedro Costa se cadastrou na plataforma e está aguardando aprovação',
    time: new Date(Date.now() - 2 * 60 * 60 * 1000),
    read: true,
    priority: 'low'
  },
  {
    id: '4',
    type: 'payment',
    title: 'Pagamento recebido',
    message: 'Pagamento de R$ 120,00 foi confirmado para o agendamento de Maria Oliveira',
    time: new Date(Date.now() - 3 * 60 * 60 * 1000),
    read: false,
    priority: 'high'
  },
  {
    id: '5',
    type: 'review',
    title: 'Nova avaliação',
    message: 'Julia Ferreira deixou uma avaliação de 5 estrelas para o serviço Manicure',
    time: new Date(Date.now() - 4 * 60 * 60 * 1000),
    read: true,
    priority: 'medium'
  },
  {
    id: '6',
    type: 'system',
    title: 'Atualização do sistema',
    message: 'Nova versão disponível com melhorias de performance e segurança',
    time: new Date(Date.now() - 6 * 60 * 60 * 1000),
    read: false,
    priority: 'low'
  },
  {
    id: '7',
    type: 'appointment',
    title: 'Agendamento cancelado',
    message: 'Carlos Santos cancelou o agendamento de Barba Completa para hoje às 16:00',
    time: new Date(Date.now() - 8 * 60 * 60 * 1000),
    read: true,
    priority: 'medium'
  },
  {
    id: '8',
    type: 'reminder',
    title: 'Lembrete de confirmação',
    message: '2 agendamentos precisam de confirmação para amanhã',
    time: new Date(Date.now() - 12 * 60 * 60 * 1000),
    read: false,
    priority: 'high'
  },
  {
    id: '9',
    type: 'client',
    title: 'Cliente inativo',
    message: 'Ana Silva não faz agendamentos há 30 dias. Considere enviar uma promoção',
    time: new Date(Date.now() - 24 * 60 * 60 * 1000),
    read: true,
    priority: 'low'
  },
  {
    id: '10',
    type: 'appointment',
    title: 'Agendamento confirmado',
    message: 'Maria Oliveira confirmou o agendamento de Coloração Completa para sexta-feira',
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    read: true,
    priority: 'medium'
  }
];

const notificationIcons = {
  appointment: Calendar,
  reminder: Clock,
  client: Users,
  system: Info,
  review: Star,
  payment: CheckCheck
};

const notificationColors = {
  appointment: 'text-blue-600 bg-blue-100',
  reminder: 'text-orange-600 bg-orange-100',
  client: 'text-purple-600 bg-purple-100',
  system: 'text-gray-600 bg-gray-100',
  review: 'text-yellow-600 bg-yellow-100',
  payment: 'text-green-600 bg-green-100'
};

const priorityColors = {
  low: 'border-l-gray-300',
  medium: 'border-l-yellow-400',
  high: 'border-l-red-400'
};

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedNotifications, setSelectedNotifications] = useState<string[]>([]);

  const filteredNotifications = notifications.filter(notification => {
    const matchesReadFilter = filter === 'all' || 
      (filter === 'unread' && !notification.read) || 
      (filter === 'read' && notification.read);
    
    const matchesTypeFilter = typeFilter === 'all' || notification.type === typeFilter;
    
    return matchesReadFilter && matchesTypeFilter;
  });

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAsUnread = (id: string) => {
    setNotifications(prev => prev.map(notification => 
      notification.id === id ? { ...notification, read: false } : notification
    ));
  };

  const handleDelete = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setSelectedNotifications(prev => prev.filter(selectedId => selectedId !== id));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(notification => ({ ...notification, read: true })));
  };

  const handleBulkAction = (action: 'read' | 'unread' | 'delete') => {
    if (action === 'delete') {
      setNotifications(prev => prev.filter(n => !selectedNotifications.includes(n.id)));
    } else {
      setNotifications(prev => prev.map(notification => 
        selectedNotifications.includes(notification.id) 
          ? { ...notification, read: action === 'read' }
          : notification
      ));
    }
    setSelectedNotifications([]);
  };

  const handleSelectNotification = (id: string) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(selectedId => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedNotifications.length === filteredNotifications.length) {
      setSelectedNotifications([]);
    } else {
      setSelectedNotifications(filteredNotifications.map(n => n.id));
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Agora';
    if (diffInMinutes < 60) return `${diffInMinutes}min atrás`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h atrás`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d atrás`;
    
    return date.toLocaleDateString('pt-BR');
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Notificações</h1>
          <p className="text-gray-600">
            {unreadCount > 0 ? `${unreadCount} notificações não lidas` : 'Todas as notificações foram lidas'}
          </p>
        </div>
        
        <div className="flex items-center space-x-3">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="flex items-center px-3 py-2 text-blue-600 hover:text-blue-700 border border-blue-200 rounded-md hover:bg-blue-50 transition-colors"
            >
              <CheckCheck className="w-4 h-4 mr-2" />
              Marcar todas como lidas
            </button>
          )}
          
          {selectedNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleBulkAction('read')}
                className="px-3 py-2 text-green-600 hover:text-green-700 border border-green-200 rounded-md hover:bg-green-50 transition-colors"
              >
                Marcar como lidas
              </button>
              <button
                onClick={() => handleBulkAction('unread')}
                className="px-3 py-2 text-orange-600 hover:text-orange-700 border border-orange-200 rounded-md hover:bg-orange-50 transition-colors"
              >
                Marcar como não lidas
              </button>
              <button
                onClick={() => handleBulkAction('delete')}
                className="px-3 py-2 text-red-600 hover:text-red-700 border border-red-200 rounded-md hover:bg-red-50 transition-colors"
              >
                Excluir
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{notifications.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Bell className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Não Lidas</p>
              <p className="text-2xl font-bold text-red-600">{unreadCount}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Hoje</p>
              <p className="text-2xl font-bold text-green-600">
                {notifications.filter(n => {
                  const today = new Date();
                  return n.time.toDateString() === today.toDateString();
                }).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Clock className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Alta Prioridade</p>
              <p className="text-2xl font-bold text-orange-600">
                {notifications.filter(n => n.priority === 'high').length}
              </p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <AlertCircle className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Filtros:</span>
            </div>
            
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'unread' | 'read')}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todas</option>
              <option value="unread">Não lidas</option>
              <option value="read">Lidas</option>
            </select>
            
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos os tipos</option>
              <option value="appointment">Agendamentos</option>
              <option value="reminder">Lembretes</option>
              <option value="client">Clientes</option>
              <option value="payment">Pagamentos</option>
              <option value="review">Avaliações</option>
              <option value="system">Sistema</option>
            </select>
          </div>
          
          {filteredNotifications.length > 0 && (
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedNotifications.length === filteredNotifications.length}
                onChange={handleSelectAll}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-600">
                {selectedNotifications.length > 0 
                  ? `${selectedNotifications.length} selecionadas`
                  : 'Selecionar todas'
                }
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12">
            <Bell className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhuma notificação encontrada
            </h3>
            <p className="text-gray-500">
              {filter === 'unread' 
                ? 'Todas as notificações foram lidas!'
                : 'Tente ajustar os filtros para ver mais notificações.'
              }
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type];
              const isSelected = selectedNotifications.includes(notification.id);
              
              return (
                <div
                  key={notification.id}
                  className={`p-6 hover:bg-gray-50 transition-colors border-l-4 ${priorityColors[notification.priority]} ${
                    !notification.read ? 'bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-start space-x-4">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleSelectNotification(notification.id)}
                      className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    />
                    
                    <div className={`p-2 rounded-lg ${notificationColors[notification.type]}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className={`font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {notification.title}
                            </h4>
                            {!notification.read && (
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            )}
                            {notification.priority === 'high' && (
                              <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-800 rounded-full">
                                Alta
                              </span>
                            )}
                          </div>
                          <p className={`text-sm ${!notification.read ? 'text-gray-700' : 'text-gray-600'}`}>
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            {formatTime(notification.time)}
                          </p>
                        </div>
                        
                        <div className="flex items-center space-x-1 ml-4">
                          {notification.read ? (
                            <button
                              onClick={() => handleMarkAsUnread(notification.id)}
                              className="p-2 text-gray-400 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                              title="Marcar como não lida"
                            >
                              <Bell className="w-4 h-4" />
                            </button>
                          ) : (
                            <button
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              title="Marcar como lida"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Excluir notificação"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}