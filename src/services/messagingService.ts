interface MessageData {
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  appointmentDate: string;
  appointmentTime: string;
  appointmentNotes?: string;
  serviceName: string;
  serviceDuration: string;
  servicePrice: string;
  businessName: string;
  businessAddress: string;
  businessPhone: string;
}

interface MessagingSettings {
  whatsappEnabled: boolean;
  whatsappApiKey: string;
  whatsappNumber: string;
  smsEnabled: boolean;
  smsApiKey: string;
  smsProvider: 'twilio' | 'nexmo' | 'custom';
  emailEnabled: boolean;
  emailProvider: 'smtp' | 'sendgrid' | 'mailgun';
  emailConfig: {
    host?: string;
    port?: number;
    username?: string;
    password?: string;
    apiKey?: string;
  };
}

interface MessageTemplate {
  id: string;
  name: string;
  subject?: string;
  content: string;
  variables: string[];
}

class MessagingService {
  private settings: MessagingSettings;

  constructor() {
    this.settings = this.loadSettings();
  }

  private loadSettings(): MessagingSettings {
    const stored = localStorage.getItem('messagingSettings');
    return stored ? JSON.parse(stored) : {
      whatsappEnabled: false,
      whatsappApiKey: '',
      whatsappNumber: '',
      smsEnabled: false,
      smsApiKey: '',
      smsProvider: 'twilio',
      emailEnabled: true,
      emailProvider: 'smtp',
      emailConfig: {}
    };
  }

  private replaceVariables(template: string, data: MessageData): string {
    let message = template;
    Object.entries(data).forEach(([key, value]) => {
      message = message.replace(new RegExp(`{{${key}}}`, 'g'), value || '');
    });
    return message;
  }

  async sendWhatsAppMessage(to: string, template: MessageTemplate, data: MessageData): Promise<boolean> {
    if (!this.settings.whatsappEnabled || !this.settings.whatsappApiKey) {
      console.warn('WhatsApp not configured');
      return false;
    }

    try {
      const message = this.replaceVariables(template.content, data);
      
      // Simulação de envio via WhatsApp Business API
      // Em produção, você integraria com a API real do WhatsApp
      console.log('Sending WhatsApp message:', {
        to,
        message,
        from: this.settings.whatsappNumber
      });

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simular sucesso (90% de chance)
      const success = Math.random() > 0.1;
      
      if (success) {
        this.logMessage('whatsapp', to, message, 'sent');
      } else {
        this.logMessage('whatsapp', to, message, 'failed');
      }
      
      return success;
    } catch (error) {
      console.error('WhatsApp send error:', error);
      this.logMessage('whatsapp', to, template.content, 'failed');
      return false;
    }
  }

  async sendSMS(to: string, template: MessageTemplate, data: MessageData): Promise<boolean> {
    if (!this.settings.smsEnabled || !this.settings.smsApiKey) {
      console.warn('SMS not configured');
      return false;
    }

    try {
      const message = this.replaceVariables(template.content, data);
      
      // Simulação de envio via provedor SMS
      console.log('Sending SMS:', {
        to,
        message,
        provider: this.settings.smsProvider
      });

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Simular sucesso (85% de chance)
      const success = Math.random() > 0.15;
      
      if (success) {
        this.logMessage('sms', to, message, 'sent');
      } else {
        this.logMessage('sms', to, message, 'failed');
      }
      
      return success;
    } catch (error) {
      console.error('SMS send error:', error);
      this.logMessage('sms', to, template.content, 'failed');
      return false;
    }
  }

  async sendEmail(to: string, template: MessageTemplate, data: MessageData): Promise<boolean> {
    if (!this.settings.emailEnabled) {
      console.warn('Email not configured');
      return false;
    }

    try {
      const subject = template.subject ? this.replaceVariables(template.subject, data) : 'Notificação de Agendamento';
      const message = this.replaceVariables(template.content, data);
      
      // Simulação de envio via provedor de email
      console.log('Sending Email:', {
        to,
        subject,
        message,
        provider: this.settings.emailProvider
      });

      // Simular delay de rede
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      // Simular sucesso (95% de chance)
      const success = Math.random() > 0.05;
      
      if (success) {
        this.logMessage('email', to, message, 'sent');
      } else {
        this.logMessage('email', to, message, 'failed');
      }
      
      return success;
    } catch (error) {
      console.error('Email send error:', error);
      this.logMessage('email', to, template.content, 'failed');
      return false;
    }
  }

  private logMessage(type: 'whatsapp' | 'sms' | 'email', to: string, message: string, status: 'sent' | 'failed'): void {
    const logs = JSON.parse(localStorage.getItem('messageLogs') || '[]');
    logs.push({
      id: Date.now().toString(),
      type,
      to,
      message: message.substring(0, 100) + (message.length > 100 ? '...' : ''),
      status,
      timestamp: new Date().toISOString()
    });
    
    // Manter apenas os últimos 100 logs
    if (logs.length > 100) {
      logs.splice(0, logs.length - 100);
    }
    
    localStorage.setItem('messageLogs', JSON.stringify(logs));
  }

  getMessageLogs(): any[] {
    return JSON.parse(localStorage.getItem('messageLogs') || '[]');
  }

  async testConnection(type: 'whatsapp' | 'sms' | 'email'): Promise<boolean> {
    try {
      console.log(`Testing ${type} connection...`);
      
      // Simular teste de conexão
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simular sucesso (80% de chance)
      return Math.random() > 0.2;
    } catch (error) {
      console.error(`${type} connection test failed:`, error);
      return false;
    }
  }
}

export const messagingService = new MessagingService();
export type { MessageData, MessagingSettings, MessageTemplate };