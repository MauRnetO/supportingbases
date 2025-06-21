import React, { useState, useEffect } from 'react';
import { X, User, Mail, Phone, Save, Tag, Calendar, Clock, MessageSquare } from 'lucide-react';
import { Lead } from '../../types';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface LeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lead: Partial<Lead>) => void;
  lead?: Lead | null;
  mode: 'create' | 'edit' | 'view';
}

const sources = [
  { id: 'website', name: 'Website', color: 'bg-blue-50 text-blue-700' },
  { id: 'social', name: 'Redes Sociais', color: 'bg-pink-50 text-pink-700' },
  { id: 'referral', name: 'Indicação', color: 'bg-green-50 text-green-700' },
  { id: 'advertising', name: 'Publicidade', color: 'bg-orange-50 text-orange-700' },
  { id: 'other', name: 'Outros', color: 'bg-gray-50 text-gray-700' }
];

const statuses = [
  { id: 'new', name: 'Novo', color: 'bg-blue-100 text-blue-800' },
  { id: 'contacted', name: 'Contatado', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'qualified', name: 'Qualificado', color: 'bg-purple-100 text-purple-800' },
  { id: 'converted', name: 'Convertido', color: 'bg-green-100 text-green-800' },
  { id: 'lost', name: 'Perdido', color: 'bg-red-100 text-red-800' }
];

export default function LeadModal({ isOpen, onClose, onSave, lead, mode }: LeadModalProps) {
  const [services] = useLocalStorage('mockServices', []);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    source: 'website' as Lead['source'],
    status: 'new' as Lead['status'],
    services: [] as string[],
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (lead && (mode === 'edit' || mode === 'view')) {
      setFormData({
        name: lead.name,
        email: lead.email,
        phone: lead.phone,
        source: lead.source,
        status: lead.status,
        services: lead.services || [],
        preferredDate: lead.preferredDate ? lead.preferredDate.toISOString().split('T')[0] : '',
        preferredTime: lead.preferredTime || '',
        notes: lead.notes || ''
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        source: 'website',
        status: 'new',
        services: [],
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
    }
    setErrors({});
  }, [lead, mode, isOpen]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.email.trim()) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Telefone é obrigatório';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') {
      onClose();
      return;
    }
    
    if (!validateForm()) return;

    const leadData: Partial<Lead> = {
      ...formData,
      preferredDate: formData.preferredDate ? new Date(formData.preferredDate) : undefined,
      ...(mode === 'edit' && lead ? { id: lead.id } : {})
    };

    onSave(leadData);
    onClose();
  };

  const handleChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    const currentServices = formData.services;
    if (currentServices.includes(serviceId)) {
      handleChange('services', currentServices.filter(id => id !== serviceId));
    } else {
      handleChange('services', [...currentServices, serviceId]);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-active="true">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-2xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Novo Lead' : mode === 'edit' ? 'Editar Lead' : 'Visualizar Lead'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Adicione um novo potencial cliente' : 
                 mode === 'edit' ? 'Atualize as informações do lead' : 
                 'Informações do lead'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.name ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                  placeholder="Digite o nome completo"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                  placeholder="lead@email.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Telefone *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.phone ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  } ${mode === 'view' ? 'bg-gray-50' : ''}`}
                  placeholder="(11) 99999-9999"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Origem</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.source}
                  onChange={(e) => handleChange('source', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                >
                  {sources.map(source => (
                    <option key={source.id} value={source.id}>{source.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Status - only show for edit/view mode */}
          {mode !== 'create' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                disabled={mode === 'view'}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                }`}
              >
                {statuses.map(status => (
                  <option key={status.id} value={status.id}>{status.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Services of Interest */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Serviços de Interesse</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {services.filter((s: any) => s.isActive).map((service: any) => (
                <label
                  key={service.id}
                  className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                    formData.services.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400'
                  } ${mode === 'view' ? 'pointer-events-none' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={formData.services.includes(service.id)}
                    onChange={() => handleServiceToggle(service.id)}
                    disabled={mode === 'view'}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{service.name}</p>
                    <p className="text-xs text-gray-500">R$ {service.price.toFixed(2)}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Preferred Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data Preferida</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="date"
                  value={formData.preferredDate}
                  onChange={(e) => handleChange('preferredDate', e.target.value)}
                  disabled={mode === 'view'}
                  min={new Date().toISOString().split('T')[0]}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário Preferido</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  value={formData.preferredTime}
                  onChange={(e) => handleChange('preferredTime', e.target.value)}
                  disabled={mode === 'view'}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                  }`}
                />
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <MessageSquare className="h-5 w-5 text-gray-400" />
              </div>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                disabled={mode === 'view'}
                rows={4}
                className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none ${
                  mode === 'view' ? 'bg-gray-50 border-gray-300' : 'border-gray-300'
                }`}
                placeholder="Informações adicionais sobre o lead..."
              />
            </div>
          </div>

          {/* Lead info for view/edit mode */}
          {mode !== 'create' && lead && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h5 className="font-medium text-gray-900 mb-2">Informações do Lead</h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500">Criado em:</span>
                  <span className="ml-2 text-gray-900">{lead.createdAt.toLocaleDateString('pt-BR')}</span>
                </div>
                {lead.lastContact && (
                  <div>
                    <span className="text-gray-500">Último contato:</span>
                    <span className="ml-2 text-gray-900">{lead.lastContact.toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
                {lead.convertedAt && (
                  <div>
                    <span className="text-gray-500">Convertido em:</span>
                    <span className="ml-2 text-green-600">{lead.convertedAt.toLocaleDateString('pt-BR')}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              {mode === 'view' ? 'Fechar' : 'Cancelar'}
            </button>
            {mode !== 'view' && (
              <button
                type="submit"
                className="flex-1 flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
              >
                <Save className="w-4 h-4 mr-2" />
                {mode === 'create' ? 'Criar Lead' : 'Salvar Alterações'}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}