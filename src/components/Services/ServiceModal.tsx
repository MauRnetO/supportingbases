import React, { useState, useEffect } from 'react';
import { X, Briefcase, Clock, DollarSign, Save, Tag } from 'lucide-react';
import { Service } from '../../types';

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (service: Partial<Service>) => void;
  service?: Service | null;
  mode: 'create' | 'edit';
}

const categories = [
  'Cabelo',
  'Barba',
  'Unhas',
  'Estética',
  'Massagem',
  'Depilação',
  'Sobrancelha',
  'Outros'
];

export default function ServiceModal({ isOpen, onClose, onSave, service, mode }: ServiceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: 30,
    price: 0,
    category: '',
    isActive: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (service && mode === 'edit') {
      setFormData({
        name: service.name,
        description: service.description,
        duration: service.duration,
        price: service.price,
        category: service.category,
        isActive: service.isActive
      });
    } else {
      setFormData({
        name: '',
        description: '',
        duration: 30,
        price: 0,
        category: '',
        isActive: true
      });
    }
    setErrors({});
  }, [service, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.description.trim()) newErrors.description = 'Descrição é obrigatória';
    if (!formData.category) newErrors.category = 'Categoria é obrigatória';
    if (formData.duration <= 0) newErrors.duration = 'Duração deve ser maior que 0';
    if (formData.price <= 0) newErrors.price = 'Preço deve ser maior que 0';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const serviceData: Partial<Service> = {
      ...formData,
      ...(mode === 'edit' && service ? { id: service.id } : {})
    };

    onSave(serviceData);
    onClose();
  };

  const handleChange = (field: string, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-active="true">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Briefcase className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Novo Serviço' : 'Editar Serviço'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Adicione um novo serviço' : 'Atualize as informações do serviço'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Nome do Serviço *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Briefcase className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Ex: Corte Masculino"
              />
            </div>
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Categoria *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Tag className="h-5 w-5 text-gray-400" />
              </div>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.category ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma categoria</option>
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            {errors.category && <p className="mt-1 text-sm text-red-600">{errors.category}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Descrição *</label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={3}
              className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                errors.description ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Descreva o serviço oferecido..."
            />
            {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Duração (minutos) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => handleChange('duration', parseInt(e.target.value) || 0)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.duration ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="30"
                />
              </div>
              {errors.duration && <p className="mt-1 text-sm text-red-600">{errors.duration}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preço (R$) *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange('price', parseFloat(e.target.value) || 0)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.price ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                  placeholder="0.00"
                />
              </div>
              {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-900">Status do Serviço</h4>
              <p className="text-sm text-gray-500">
                {formData.isActive ? 'Serviço ativo e disponível para agendamento' : 'Serviço inativo e indisponível'}
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                checked={formData.isActive}
                onChange={(e) => handleChange('isActive', e.target.checked)}
                className="sr-only peer" 
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
            >
              <Save className="w-4 h-4 mr-2" />
              {mode === 'create' ? 'Criar Serviço' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}