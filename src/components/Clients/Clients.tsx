import React, { useState } from 'react';
import { Plus, Search, Mail, Phone, Calendar, User, Edit, Trash2, Eye } from 'lucide-react';
import { mockClients } from '../../data/mockData';
import { Client } from '../../types';
import ClientModal from './ClientModal';
import DeleteConfirmModal from './DeleteConfirmModal';

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(mockClients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.phone.includes(searchTerm)
  );

  const handleCreateClient = () => {
    setSelectedClient(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setSelectedClient(client);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteClient = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleSaveClient = (clientData: Partial<Client>) => {
    if (modalMode === 'create') {
      const newClient: Client = {
        id: Date.now().toString(),
        name: clientData.name!,
        email: clientData.email!,
        phone: clientData.phone!,
        notes: clientData.notes,
        createdAt: new Date(),
        totalAppointments: 0
      };
      setClients(prev => [...prev, newClient]);
    } else if (modalMode === 'edit' && selectedClient) {
      setClients(prev => prev.map(client => 
        client.id === selectedClient.id 
          ? { ...client, ...clientData }
          : client
      ));
    }
  };

  const handleConfirmDelete = () => {
    if (selectedClient) {
      setClients(prev => prev.filter(client => client.id !== selectedClient.id));
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Clientes</h1>
          <p className="text-gray-600">Gerencie sua base de clientes</p>
        </div>
        <button 
          onClick={handleCreateClient}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Cliente
        </button>
      </div>
      
      {/* Search Bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Buscar por nome, email ou telefone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Clientes</p>
              <p className="text-2xl font-bold text-gray-900">{clients.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <User className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Novos este Mês</p>
              <p className="text-2xl font-bold text-green-600">
                {clients.filter(c => {
                  const thisMonth = new Date();
                  return c.createdAt.getMonth() === thisMonth.getMonth() && 
                         c.createdAt.getFullYear() === thisMonth.getFullYear();
                }).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <Plus className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Clientes Ativos</p>
              <p className="text-2xl font-bold text-purple-600">
                {clients.filter(c => c.lastVisit && 
                  (new Date().getTime() - c.lastVisit.getTime()) < (30 * 24 * 60 * 60 * 1000)
                ).length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Calendar className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Clients Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <div key={client.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditClient(client)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar cliente"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteClient(client)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir cliente"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-gray-900">{client.name}</h3>
                <p className="text-sm text-gray-500">Cliente desde {client.createdAt.toLocaleDateString('pt-BR')}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center text-sm text-gray-600">
                  <Mail className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span className="truncate">{client.email}</span>
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <Phone className="w-4 h-4 mr-2 flex-shrink-0" />
                  {client.phone}
                </div>
                {client.lastVisit && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                    Última visita: {client.lastVisit.toLocaleDateString('pt-BR')}
                  </div>
                )}
              </div>

              {client.notes && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-600 line-clamp-2">{client.notes}</p>
                </div>
              )}
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200 flex items-center justify-between">
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                {client.totalAppointments} agendamentos
              </span>
              <button className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                Agendar
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredClients.length === 0 && (
        <div className="text-center py-12">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm ? 'Nenhum cliente encontrado' : 'Nenhum cliente cadastrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm 
              ? 'Tente ajustar sua busca ou verifique a ortografia.' 
              : 'Comece adicionando seu primeiro cliente.'
            }
          </p>
          {!searchTerm && (
            <button 
              onClick={handleCreateClient}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Cliente
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <ClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveClient}
        client={selectedClient}
        mode={modalMode}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        client={selectedClient}
      />
    </div>
  );
}