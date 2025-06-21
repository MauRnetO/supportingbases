import { useEffect, useCallback } from 'react';
import { messagingService, MessageData } from '../services/messagingService';
import { Appointment, Client, Service } from '../types';

interface AutomaticMessage {
  id: string;
  name: string;
  type: 'whatsapp' | 'sms' | 'email';
  trigger: 'before_appointment' | 'day_of_appointment' | 'after_appointment';
  timing: number; // minutes before/after
  enabled: boolean;
  template: {
    id: string;
    name: string;
    subject?: string;
    content: string;
    variables: string[];
  };
}

export function useAutomaticMessaging(
  appointments: Appointment[],
  clients: Client[],
  services: Service[]
) {
  const processAutomaticMessages = useCallback(async () => {
    const automaticMessages: AutomaticMessage[] = JSON.parse(
      localStorage.getItem('automaticMessages') || '[]'
    );
    
    const businessSettings = JSON.parse(
      localStorage.getItem('businessSettings') || '{}'
    );

    const now = new Date();
    
    for (const appointment of appointments) {
      const client = clients.find(c => c.id === appointment.clientId);
      const service = services.find(s => s.id === appointment.serviceId);
      
      if (!client || !service) continue;

      const appointmentDateTime = new Date(appointment.date);
      appointmentDateTime.setHours(
        parseInt(appointment.time.split(':')[0]),
        parseInt(appointment.time.split(':')[1])
      );

      for (const message of automaticMessages) {
        if (!message.enabled) continue;

        let shouldSend = false;
        let triggerTime = new Date(appointmentDateTime);

        switch (message.trigger) {
          case 'before_appointment':
            triggerTime.setMinutes(triggerTime.getMinutes() - message.timing);
            shouldSend = now >= triggerTime && now < appointmentDateTime;
            break;
          
          case 'day_of_appointment':
            const dayStart = new Date(appointmentDateTime);
            dayStart.setHours(0, 0, 0, 0);
            const dayEnd = new Date(appointmentDateTime);
            dayEnd.setHours(23, 59, 59, 999);
            shouldSend = now >= dayStart && now <= dayEnd;
            break;
          
          case 'after_appointment':
            triggerTime.setMinutes(triggerTime.getMinutes() + message.timing);
            shouldSend = now >= triggerTime;
            break;
        }

        if (shouldSend) {
          // Verificar se já foi enviada
          const messageKey = `sent_${message.id}_${appointment.id}`;
          if (localStorage.getItem(messageKey)) continue;

          const messageData: MessageData = {
            clientName: client.name,
            clientEmail: client.email,
            clientPhone: client.phone,
            appointmentDate: appointment.date.toLocaleDateString('pt-BR'),
            appointmentTime: appointment.time,
            appointmentNotes: appointment.notes || '',
            serviceName: service.name,
            serviceDuration: service.duration.toString(),
            servicePrice: service.price.toFixed(2),
            businessName: businessSettings.name || 'Seu Negócio',
            businessAddress: businessSettings.address || '',
            businessPhone: businessSettings.phone || ''
          };

          let success = false;

          try {
            switch (message.type) {
              case 'whatsapp':
                success = await messagingService.sendWhatsAppMessage(
                  client.phone,
                  message.template,
                  messageData
                );
                break;
              
              case 'sms':
                success = await messagingService.sendSMS(
                  client.phone,
                  message.template,
                  messageData
                );
                break;
              
              case 'email':
                success = await messagingService.sendEmail(
                  client.email,
                  message.template,
                  messageData
                );
                break;
            }

            if (success) {
              // Marcar como enviada
              localStorage.setItem(messageKey, 'sent');
              
              // Adicionar notificação de sucesso
              const notifications = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
              notifications.unshift({
                id: Date.now().toString(),
                type: 'system',
                title: 'Mensagem enviada',
                message: `${message.type.toUpperCase()} enviado para ${client.name}: ${message.name}`,
                time: new Date(),
                read: false,
                priority: 'low'
              });
              localStorage.setItem('systemNotifications', JSON.stringify(notifications.slice(0, 50)));
            }
          } catch (error) {
            console.error('Error sending automatic message:', error);
            
            // Adicionar notificação de erro
            const notifications = JSON.parse(localStorage.getItem('systemNotifications') || '[]');
            notifications.unshift({
              id: Date.now().toString(),
              type: 'system',
              title: 'Erro ao enviar mensagem',
              message: `Falha ao enviar ${message.type.toUpperCase()} para ${client.name}`,
              time: new Date(),
              read: false,
              priority: 'high'
            });
            localStorage.setItem('systemNotifications', JSON.stringify(notifications.slice(0, 50)));
          }
        }
      }
    }
  }, [appointments, clients, services]);

  useEffect(() => {
    // Executar verificação a cada minuto
    const interval = setInterval(processAutomaticMessages, 60000);
    
    // Executar uma vez ao montar
    processAutomaticMessages();
    
    return () => clearInterval(interval);
  }, [processAutomaticMessages]);

  return {
    processAutomaticMessages
  };
}