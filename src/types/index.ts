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

export interface Service {
  id: string;
  name: string;
  description: string;
  duration: number; // in minutes
  price: number;
  category: string;
  isActive: boolean;
}

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
  rating?: number; // 1-5 stars
  feedback?: string; // comentário do cliente
}

export interface BusinessStats {
  totalRevenue: number;
  totalAppointments: number;
  totalClients: number;
  avgRating: number;
  upcomingAppointments: number;
  todayAppointments: number;
}

export interface ClientReview {
  id: string;
  clientId: string;
  appointmentId: string;
  serviceId: string;
  rating: number; // 1-5 stars
  feedback: string;
  date: Date;
  isPublic: boolean;
}

// Team Management Types
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member';
  permissions: string[];
  isActive: boolean;
  createdAt: Date;
  lastActive?: Date;
  skills: string[];
  hourlyRate?: number;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignedTo: string[]; // TeamMember IDs
  createdBy: string; // TeamMember ID
  projectId: string;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  attachments: string[];
  comments: TaskComment[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface TaskComment {
  id: string;
  taskId: string;
  authorId: string;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
  startDate: Date;
  endDate?: Date;
  teamMembers: string[]; // TeamMember IDs
  ownerId: string; // TeamMember ID
  budget?: number;
  progress: number; // 0-100
  createdAt: Date;
  updatedAt: Date;
}

// Client Portal Types
export interface Lead {
  id: string;
  name: string;
  email: string;
  phone: string;
  source: 'website' | 'social' | 'referral' | 'advertising' | 'other';
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost';
  services: string[]; // Interested services
  preferredDate?: Date;
  preferredTime?: string;
  notes?: string;
  createdAt: Date;
  convertedAt?: Date;
  lastContact?: Date;
}

export interface PublicAppointment {
  id: string;
  leadId: string;
  serviceId: string;
  preferredDates: Date[];
  preferredTimes: string[];
  status: 'pending' | 'confirmed' | 'rejected';
  message?: string;
  createdAt: Date;
  respondedAt?: Date;
}