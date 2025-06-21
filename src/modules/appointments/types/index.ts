export interface Appointment {
  id: string;
  clientId: string;
  serviceId: string;
  date: Date;
  time: string;
  status: 'scheduled' | 'confirmed' | 'completed' | 'cancelled' | 'no-show';
  notes?: string;
  duration: number;
  price: number;
  rating?: number;
  feedback?: string;
}

export interface AppointmentFormData {
  clientId: string;
  serviceId: string;
  date: string;
  time: string;
  notes: string;
  status: Appointment['status'];
  rating: number;
  feedback: string;
}