import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, Filter, Edit, Trash2 } from 'lucide-react';
import { mockAppointments, mockClients, mockServices } from '../../data/mockData';
import { Appointment } from '../../types';
import AppointmentModal from './AppointmentModal';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800 border-blue-200',
  confirmed: 'bg-green-100 text-green-800 border-green-200',
  completed: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelled: 'bg-red-100 text-red-800 border-red-200',
  'no-show': 'bg-yellow-100 text-yellow-800 border-yellow-200'
};

const statusLabels = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  'no-show': 'Não Compareceu'
};

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [appointments, setAppointments] = useState(mockAppointments);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];
  
  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };
  
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate);
    if (direction === 'prev') {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
  };
  
  const getAppointmentsForDate = (date: Date) => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    );
  };

  const handleCreateAppointment = (date?: Date) => {
    setSelectedAppointment(null);
    setModalMode('create');
    setSelectedDate(date || null);
    setIsModalOpen(true);
  };

  const handleEditAppointment = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDeleteAppointment = (appointmentId: string) => {
    if (confirm('Tem certeza que deseja excluir este agendamento?')) {
      setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
    }
  };

  const handleSaveAppointment = (appointmentData: Partial<Appointment>) => {
    if (modalMode === 'create') {
      const newAppointment: Appointment = {
        id: Date.now().toString(),
        clientId: appointmentData.clientId!,
        serviceId: appointmentData.serviceId!,
        date: appointmentData.date!,
        time: appointmentData.time!,
        status: appointmentData.status!,
        duration: appointmentData.duration!,
        price: appointmentData.price!,
        notes: appointmentData.notes,
        rating: appointmentData.rating,
        feedback: appointmentData.feedback
      };
      setAppointments(prev => [...prev, newAppointment]);
    } else if (modalMode === 'edit' && selectedAppointment) {
      setAppointments(prev => prev.map(apt => 
        apt.id === selectedAppointment.id 
          ? { ...apt, ...appointmentData }
          : apt
      ));
    }
  };
  
  const days = getDaysInMonth(currentDate);
  const today = new Date();
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Calendário</h1>
          <p className="text-gray-600">Gerencie seus agendamentos</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="w-4 h-4 mr-2" />
            Filtros
          </button>
          <button 
            onClick={() => handleCreateAppointment()}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Agendamento
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {/* Calendar Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigateMonth('prev')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setCurrentDate(new Date())}
              className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors"
            >
              Hoje
            </button>
            <button
              onClick={() => navigateMonth('next')}
              className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
        
        {/* Calendar Grid */}
        <div className="p-6">
          {/* Day Headers */}
          <div className="grid grid-cols-7 gap-1 mb-4">
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
              <div key={day} className="p-2 text-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
          </div>
          
          {/* Calendar Days */}
          <div className="grid grid-cols-7 gap-1">
            {days.map((day, index) => {
              if (!day) {
                return <div key={index} className="p-2 h-24"></div>;
              }
              
              const dayAppointments = getAppointmentsForDate(day);
              const isToday = day.toDateString() === today.toDateString();
              const isSelected = selectedDate?.toDateString() === day.toDateString();
              
              return (
                <div
                  key={index}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    p-2 h-24 border border-gray-200 cursor-pointer hover:bg-blue-50 transition-colors relative
                    ${isToday ? 'bg-blue-50 border-blue-200' : ''}
                    ${isSelected ? 'bg-blue-100 border-blue-300' : ''}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between mb-1">
                      <span className={`
                        text-sm font-medium
                        ${isToday ? 'text-blue-600' : 'text-gray-900'}
                      `}>
                        {day.getDate()}
                      </span>
                      {dayAppointments.length > 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateAppointment(day);
                          }}
                          className="opacity-0 hover:opacity-100 p-1 hover:bg-blue-100 rounded transition-all"
                          title="Novo agendamento"
                        >
                          <Plus className="w-3 h-3 text-blue-600" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex-1 space-y-1 overflow-hidden">
                      {dayAppointments.slice(0, 2).map((apt, i) => {
                        const client = mockClients.find(c => c.id === apt.clientId);
                        return (
                          <div
                            key={i}
                            className={`text-xs p-1 rounded truncate border ${statusColors[apt.status]}`}
                            title={`${apt.time} - ${client?.name} (${statusLabels[apt.status]})`}
                          >
                            {apt.time} - {client?.name}
                          </div>
                        );
                      })}
                      {dayAppointments.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{dayAppointments.length - 2} mais
                        </div>
                      )}
                      {dayAppointments.length === 0 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCreateAppointment(day);
                          }}
                          className="w-full h-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                        >
                          <Plus className="w-4 h-4 text-gray-400" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      
      {/* Selected Date Details */}
      {selectedDate && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Agendamentos para {selectedDate.toLocaleDateString('pt-BR')}
            </h3>
            <button
              onClick={() => handleCreateAppointment(selectedDate)}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              <Plus className="w-4 h-4 mr-1" />
              Novo
            </button>
          </div>
          
          {getAppointmentsForDate(selectedDate).length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 mb-4">Nenhum agendamento para este dia.</p>
              <button
                onClick={() => handleCreateAppointment(selectedDate)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Criar Primeiro Agendamento
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {getAppointmentsForDate(selectedDate).map((apt) => {
                const client = mockClients.find(c => c.id === apt.clientId);
                const service = mockServices.find(s => s.id === apt.serviceId);
                
                return (
                  <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <p className="font-medium text-gray-900">{client?.name}</p>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${statusColors[apt.status]}`}>
                          {statusLabels[apt.status]}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">{service?.name}</p>
                      {apt.notes && (
                        <p className="text-sm text-gray-500 mt-1">{apt.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{apt.time}</p>
                        <p className="text-sm text-green-600">R$ {apt.price.toFixed(2)}</p>
                      </div>
                      <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEditAppointment(apt)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Editar agendamento"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteAppointment(apt.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Excluir agendamento"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAppointment}
        appointment={selectedAppointment}
        mode={modalMode}
        clients={mockClients}
        services={mockServices}
        selectedDate={selectedDate || undefined}
      />
    </div>
  );
}