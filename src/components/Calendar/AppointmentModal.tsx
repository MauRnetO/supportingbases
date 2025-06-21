import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, User, Briefcase, Save, DollarSign, Star } from 'lucide-react';
import { Appointment, Client, Service } from '../../types';

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (appointment: Partial<Appointment>) => void;
  appointment?: Appointment | null;
  mode: 'create' | 'edit';
  clients: Client[];
  services: Service[];
  selectedDate?: Date;
}

export default function AppointmentModal({ 
  isOpen, 
  onClose, 
  onSave, 
  appointment, 
  mode, 
  clients, 
  services,
  selectedDate 
}: AppointmentModalProps) {
  const [formData, setFormData] = useState({
    clientId: '',
    serviceId: '',
    date: '',
    time: '',
    notes: '',
    status: 'scheduled' as Appointment['status'],
    rating: 0,
    feedback: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showRatingSection, setShowRatingSection] = useState(false);

  useEffect(() => {
    if (appointment && mode === 'edit') {
      setFormData({
        clientId: appointment.clientId,
        serviceId: appointment.serviceId,
        date: appointment.date.toISOString().split('T')[0],
        time: appointment.time,
        notes: appointment.notes || '',
        status: appointment.status,
        rating: appointment.rating || 0,
        feedback: appointment.feedback || ''
      });
      setShowRatingSection(appointment.status === 'completed' && appointment.rating !== undefined);
    } else {
      setFormData({
        clientId: '',
        serviceId: '',
        date: selectedDate ? selectedDate.toISOString().split('T')[0] : '',
        time: '',
        notes: '',
        status: 'scheduled',
        rating: 0,
        feedback: ''
      });
      setShowRatingSection(false);
    }
    setErrors({});
  }, [appointment, mode, isOpen, selectedDate]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.clientId) newErrors.clientId = 'Cliente é obrigatório';
    if (!formData.serviceId) newErrors.serviceId = 'Serviço é obrigatório';
    if (!formData.date) newErrors.date = 'Data é obrigatória';
    if (!formData.time) newErrors.time = 'Horário é obrigatório';

    // Validar avaliação se estiver visível
    if (showRatingSection && formData.rating > 0 && !formData.feedback.trim()) {
      newErrors.feedback = 'Comentário é obrigatório quando há avaliação';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    const selectedService = services.find(s => s.id === formData.serviceId);
    
    const appointmentData: Partial<Appointment> = {
      ...formData,
      date: new Date(formData.date),
      duration: selectedService?.duration || 30,
      price: selectedService?.price || 0,
      rating: showRatingSection && formData.rating > 0 ? formData.rating : undefined,
      feedback: showRatingSection && formData.feedback.trim() ? formData.feedback : undefined,
      ...(mode === 'edit' && appointment ? { id: appointment.id } : {})
    };

    onSave(appointmentData);
    
    // Se foi adicionada uma avaliação, salvar também nas reviews
    if (showRatingSection && formData.rating > 0 && formData.feedback.trim()) {
      const reviews = JSON.parse(localStorage.getItem('clientReviews') || '[]');
      const newReview = {
        id: Date.now().toString(),
        clientId: formData.clientId,
        appointmentId: appointment?.id || Date.now().toString(),
        serviceId: formData.serviceId,
        rating: formData.rating,
        feedback: formData.feedback,
        date: new Date(),
        isPublic: true
      };
      reviews.push(newReview);
      localStorage.setItem('clientReviews', JSON.stringify(reviews));
    }
    
    onClose();
  };

  const handleChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleStatusChange = (status: string) => {
    setFormData(prev => ({ ...prev, status: status as Appointment['status'] }));
    setShowRatingSection(status === 'completed');
    if (status !== 'completed') {
      setFormData(prev => ({ ...prev, rating: 0, feedback: '' }));
    }
  };

  const selectedService = services.find(s => s.id === formData.serviceId);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" data-modal-active="true">
      <div className="modal-content bg-white rounded-xl shadow-2xl w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {mode === 'create' ? 'Novo Agendamento' : 'Editar Agendamento'}
              </h2>
              <p className="text-sm text-gray-500">
                {mode === 'create' ? 'Crie um novo agendamento' : 'Atualize as informações do agendamento'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cliente *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.clientId}
                  onChange={(e) => handleChange('clientId', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.clientId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um cliente</option>
                  {clients.map(client => (
                    <option key={client.id} value={client.id}>{client.name}</option>
                  ))}
                </select>
              </div>
              {errors.clientId && <p className="mt-1 text-sm text-red-600">{errors.clientId}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Serviço *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  value={formData.serviceId}
                  onChange={(e) => handleChange('serviceId', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.serviceId ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecione um serviço</option>
                  {services.filter(s => s.isActive).map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - R$ {service.price.toFixed(2)}
                    </option>
                  ))}
                </select>
              </div>
              {errors.serviceId && <p className="mt-1 text-sm text-red-600">{errors.serviceId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Data *</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => handleChange('date', e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className={`block w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.date ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.date && <p className="mt-1 text-sm text-red-600">{errors.date}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Horário *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange('time', e.target.value)}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.time ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.time && <p className="mt-1 text-sm text-red-600">{errors.time}</p>}
            </div>
          </div>

          {mode === 'edit' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={formData.status}
                onChange={(e) => handleStatusChange(e.target.value)}
                className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
              >
                <option value="scheduled">Agendado</option>
                <option value="confirmed">Confirmado</option>
                <option value="completed">Concluído</option>
                <option value="cancelled">Cancelado</option>
                <option value="no-show">Não Compareceu</option>
              </select>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Observações</label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleChange('notes', e.target.value)}
              rows={3}
              className="block w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors resize-none"
              placeholder="Informações adicionais sobre o agendamento..."
            />
          </div>

          {/* Seção de Avaliação - só aparece quando status é "completed" */}
          {showRatingSection && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-medium text-yellow-900 mb-3 flex items-center">
                <Star className="w-4 h-4 mr-2" />
                Avaliação do Cliente
              </h4>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-yellow-800 mb-2">
                    Avaliação (1-5 estrelas)
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleChange('rating', star)}
                        className={`p-1 rounded transition-colors ${
                          star <= formData.rating 
                            ? 'text-yellow-500' 
                            : 'text-gray-300 hover:text-yellow-400'
                        }`}
                      >
                        <Star className={`w-6 h-6 ${star <= formData.rating ? 'fill-current' : ''}`} />
                      </button>
                    ))}
                  </div>
                  <p className="text-xs text-yellow-700 mt-1">
                    {formData.rating === 0 ? 'Clique nas estrelas para avaliar' : 
                     formData.rating === 1 ? 'Muito ruim' :
                     formData.rating === 2 ? 'Ruim' :
                     formData.rating === 3 ? 'Regular' :
                     formData.rating === 4 ? 'Bom' : 'Excelente'}
                  </p>
                </div>

                {formData.rating > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-yellow-800 mb-2">
                      Comentário do Cliente *
                    </label>
                    <textarea
                      value={formData.feedback}
                      onChange={(e) => handleChange('feedback', e.target.value)}
                      rows={3}
                      className={`block w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 transition-colors resize-none ${
                        errors.feedback ? 'border-red-300 bg-red-50' : 'border-yellow-300'
                      }`}
                      placeholder="O que o cliente achou do serviço?"
                    />
                    {errors.feedback && <p className="mt-1 text-sm text-red-600">{errors.feedback}</p>}
                  </div>
                )}
              </div>
            </div>
          )}

          {selectedService && (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-blue-900">{selectedService.name}</p>
                  <p className="text-sm text-blue-700">Duração: {selectedService.duration} minutos</p>
                </div>
                <div className="flex items-center text-blue-900">
                  <DollarSign className="w-4 h-4 mr-1" />
                  <span className="font-bold">R$ {selectedService.price.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

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
              {mode === 'create' ? 'Criar Agendamento' : 'Salvar Alterações'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}