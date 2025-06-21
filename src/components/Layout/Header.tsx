import React, { useState } from 'react';
import { Menu, Bell, Search, User, Calendar, Users, Briefcase } from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface HeaderProps {
  onMenuToggle: () => void;
  onSectionChange?: (section: string) => void;
}

interface UserProfile {
  name: string;
  email: string;
  avatar?: string;
}

export default function Header({ onMenuToggle, onSectionChange }: HeaderProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Carregar perfil do usuário do localStorage
  const [userProfile] = useLocalStorage<UserProfile>('userProfile', {
    name: 'João Silva',
    email: 'joao@email.com'
  });

  const notifications = [
    {
      id: 1,
      type: 'appointment',
      title: 'Novo agendamento',
      message: 'Ana Silva agendou um corte para amanhã às 14:00',
      time: '5 min atrás',
      unread: true
    },
    {
      id: 2,
      type: 'reminder',
      title: 'Lembrete',
      message: 'Você tem 3 agendamentos hoje',
      time: '1 hora atrás',
      unread: true
    },
    {
      id: 3,
      type: 'client',
      title: 'Novo cliente',
      message: 'Carlos Santos se cadastrou na plataforma',
      time: '2 horas atrás',
      unread: false
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleViewAllNotifications = () => {
    setShowNotifications(false);
    if (onSectionChange) {
      onSectionChange('notifications');
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
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <button
              onClick={onMenuToggle}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden sm:block ml-4 lg:ml-0">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Buscar clientes, serviços..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                
                {/* Search Results Dropdown */}
                {searchTerm && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                    <div className="p-2">
                      <div className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                        <Users className="w-4 h-4 mr-2 text-gray-400" />
                        Buscar em clientes
                      </div>
                      <div className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                        <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                        Buscar em serviços
                      </div>
                      <div className="flex items-center px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded cursor-pointer">
                        <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                        Buscar em agendamentos
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Notifications Dropdown */}
              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">Notificações</h3>
                      {unreadCount > 0 && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {unreadCount} novas
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="max-h-96 overflow-y-auto">
                    {notifications.map((notification) => (
                      <div 
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          notification.unread ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <div className={`w-2 h-2 rounded-full mt-2 ${
                            notification.unread ? 'bg-blue-500' : 'bg-gray-300'
                          }`}></div>
                          <div className="flex-1">
                            <p className="font-medium text-gray-900 text-sm">{notification.title}</p>
                            <p className="text-gray-600 text-sm mt-1">{notification.message}</p>
                            <p className="text-gray-400 text-xs mt-2">{notification.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="p-3 border-t border-gray-200">
                    <button 
                      onClick={handleViewAllNotifications}
                      className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Ver todas as notificações
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* User Profile */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                {userProfile.avatar ? (
                  <img 
                    src={userProfile.avatar} 
                    alt={userProfile.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-blue-600 font-medium text-sm">
                    {getInitials(userProfile.name)}
                  </span>
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{userProfile.name}</p>
                <p className="text-xs text-gray-500">Administrador</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}