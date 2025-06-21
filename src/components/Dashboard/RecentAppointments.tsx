import React from 'react';
import { Clock, User, Calendar as CalendarIcon } from 'lucide-react';

const statusColors = {
  scheduled: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-green-100 text-green-800',
  completed: 'bg-gray-100 text-gray-800',
  cancelled: 'bg-red-100 text-red-800',
  'no-show': 'bg-yellow-100 text-yellow-800'
};

const statusLabels = {
  scheduled: 'Agendado',
  confirmed: 'Confirmado',
  completed: 'Concluído',
  cancelled: 'Cancelado',
  'no-show': 'Não Compareceu'
};

export default function RecentAppointments() {
  // Carregar dados reais do localStorage
  const appointments = JSON.parse(localStorage.getItem('mockAppointments') || '[]').map((apt: any) => ({
    ...apt,
    date: new Date(apt.date)
  }));
  
  const clients = JSON.parse(localStorage.getItem('mockClients') || '[]').map((client: any) => ({
    ...client,
    createdAt: new Date(client.createdAt),
    lastVisit: client.lastVisit ? new Date(client.lastVisit) : undefined
  }));
  
  const services = JSON.parse(localStorage.getItem('mockServices') || '[]');

  // Pegar os 5 agendamentos mais recentes
  const recentAppointments = appointments
    .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Agendamentos Recentes</h3>
          {appointments.length > 5 && (
            <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
              Ver todos
            </button>
          )}
        </div>
      </div>
      
      {recentAppointments.length === 0 ? (
        <div className="p-8 text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CalendarIcon className="w-6 h-6 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-2">Nenhum agendamento ainda</h4>
          <p className="text-gray-500 mb-4">
            Quando você criar agendamentos, eles aparecerão aqui.
          </p>
          <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
            <CalendarIcon className="w-4 h-4 mr-2" />
            Criar Primeiro Agendamento
          </button>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {recentAppointments.map((appointment: any) => {
            const client = clients.find((c: any) => c.id === appointment.clientId);
            const service = services.find((s: any) => s.id === appointment.serviceId);
            
            return (
              <div key={appointment.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{client?.name || 'Cliente não encontrado'}</p>
                      <p className="text-sm text-gray-500">{service?.name || 'Serviço não encontrado'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <div className="flex items-center text-sm text-gray-600">
                        <CalendarIcon className="w-4 h-4 mr-1" />
                        {appointment.date.toLocaleDateString('pt-BR')}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Clock className="w-4 h-4 mr-1" />
                        {appointment.time}
                      </div>
                    </div>
                    
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[appointment.status as keyof typeof statusColors]}`}>
                      {statusLabels[appointment.status as keyof typeof statusLabels]}
                    </span>
                    
                    <div className="text-right">
                      <p className="font-medium text-gray-900">R$ {appointment.price.toFixed(2)}</p>
                      <p className="text-xs text-gray-500">{appointment.duration}min</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}