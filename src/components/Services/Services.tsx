import React, { useState } from 'react';
import { Plus, Search, Clock, DollarSign, Edit, Trash2, Tag, ToggleLeft, ToggleRight, Briefcase } from 'lucide-react';
import { mockServices } from '../../data/mockData';
import { Service } from '../../types';
import ServiceModal from './ServiceModal';

export default function Services() {
  const [searchTerm, setSearchTerm] = useState('');
  const [services, setServices] = useState(mockServices);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  
  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });
  
  const categories = [...new Set(services.map(s => s.category))];

  const handleCreateService = () => {
    setSelectedService(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEditService = (service: Service) => {
    setSelectedService(service);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteService = (serviceId: string) => {
    if (confirm('Tem certeza que deseja excluir este serviço?')) {
      setServices(prev => prev.filter(service => service.id !== serviceId));
    }
  };

  const handleToggleStatus = (serviceId: string) => {
    setServices(prev => prev.map(service => 
      service.id === serviceId 
        ? { ...service, isActive: !service.isActive }
        : service
    ));
  };

  const handleSaveService = (serviceData: Partial<Service>) => {
    if (modalMode === 'create') {
      const newService: Service = {
        id: Date.now().toString(),
        name: serviceData.name!,
        description: serviceData.description!,
        duration: serviceData.duration!,
        price: serviceData.price!,
        category: serviceData.category!,
        isActive: serviceData.isActive!
      };
      setServices(prev => [...prev, newService]);
    } else if (modalMode === 'edit' && selectedService) {
      setServices(prev => prev.map(service => 
        service.id === selectedService.id 
          ? { ...service, ...serviceData }
          : service
      ));
    }
  };
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Serviços</h1>
          <p className="text-gray-600">Gerencie seus serviços e preços</p>
        </div>
        <button 
          onClick={handleCreateService}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Serviço
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Total de Serviços</p>
              <p className="text-2xl font-bold text-gray-900">{services.length}</p>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <Briefcase className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Serviços Ativos</p>
              <p className="text-2xl font-bold text-green-600">
                {services.filter(s => s.isActive).length}
              </p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <ToggleRight className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Preço Médio</p>
              <p className="text-2xl font-bold text-purple-600">
                R$ {(services.reduce((sum, s) => sum + s.price, 0) / services.length).toFixed(2)}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <DollarSign className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600">Categorias</p>
              <p className="text-2xl font-bold text-orange-600">{categories.length}</p>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg">
              <Tag className="w-6 h-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>
      
      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Buscar serviços..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Todas as categorias</option>
          {categories.map((category) => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>
      
      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service) => (
          <div key={service.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200 group">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-gray-900">{service.name}</h3>
                  <button
                    onClick={() => handleToggleStatus(service.id)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title={service.isActive ? 'Desativar serviço' : 'Ativar serviço'}
                  >
                    {service.isActive ? (
                      <ToggleRight className="w-5 h-5 text-green-600" />
                    ) : (
                      <ToggleLeft className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  <Tag className="w-3 h-3 mr-1" />
                  {service.category}
                </span>
              </div>
              <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => handleEditService(service)}
                  className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Editar serviço"
                >
                  <Edit className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => handleDeleteService(service.id)}
                  className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Excluir serviço"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">{service.description}</p>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-sm text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  {service.duration} minutos
                </div>
                <div className="flex items-center text-lg font-semibold text-green-600">
                  <DollarSign className="w-4 h-4 mr-1" />
                  {service.price.toFixed(2)}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Status</span>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  service.isActive 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {service.isActive ? 'Ativo' : 'Inativo'}
                </span>
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-200">
              <button 
                className={`w-full px-3 py-2 text-sm rounded-md transition-colors ${
                  service.isActive 
                    ? 'bg-blue-600 text-white hover:bg-blue-700' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                disabled={!service.isActive}
              >
                {service.isActive ? 'Agendar Serviço' : 'Serviço Inativo'}
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {filteredServices.length === 0 && (
        <div className="text-center py-12">
          <Tag className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || selectedCategory ? 'Nenhum serviço encontrado' : 'Nenhum serviço cadastrado'}
          </h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || selectedCategory 
              ? 'Tente ajustar sua busca ou filtros.' 
              : 'Comece adicionando seu primeiro serviço.'
            }
          </p>
          {!searchTerm && !selectedCategory && (
            <button 
              onClick={handleCreateService}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Serviço
            </button>
          )}
        </div>
      )}

      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveService}
        service={selectedService}
        mode={modalMode}
      />
    </div>
  );
}