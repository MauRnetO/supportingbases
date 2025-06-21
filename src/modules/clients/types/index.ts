export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  createdAt: Date;
  totalAppointments: number;
  lastVisit?: Date;
  notes?: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  notes: string;
}