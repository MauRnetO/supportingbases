import { Client, Service, Appointment, BusinessStats, ClientReview } from '../types';

// Função para carregar dados do localStorage ou retornar array vazio
const loadFromStorage = (key: string, defaultValue: any[] = []) => {
  try {
    const stored = localStorage.getItem(key);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Converter datas se necessário
      if (key === 'mockAppointments') {
        return parsed.map((apt: any) => ({
          ...apt,
          date: new Date(apt.date)
        }));
      }
      if (key === 'mockClients') {
        return parsed.map((client: any) => ({
          ...client,
          createdAt: new Date(client.createdAt),
          lastVisit: client.lastVisit ? new Date(client.lastVisit) : undefined
        }));
      }
      if (key === 'clientReviews') {
        return parsed.map((review: any) => ({
          ...review,
          date: new Date(review.date)
        }));
      }
      return parsed;
    }
  } catch (error) {
    console.error(`Error loading ${key} from localStorage:`, error);
  }
  return defaultValue;
};

// Dados iniciais (só serão usados se não houver dados no localStorage)
const initialClients: Client[] = [
  {
    id: '1',
    name: 'Ana Silva',
    email: 'ana.silva@email.com',
    phone: '(11) 99999-1111',
    createdAt: new Date('2024-01-15'),
    totalAppointments: 12,
    lastVisit: new Date('2024-12-10'),
    notes: 'Cliente preferencial, sempre pontual. Gosta de cortes modernos.'
  },
  {
    id: '2',
    name: 'Carlos Santos',
    email: 'carlos.santos@email.com',
    phone: '(11) 99999-2222',
    createdAt: new Date('2024-02-20'),
    totalAppointments: 8,
    lastVisit: new Date('2024-12-08'),
    notes: 'Executivo, prefere horários pela manhã.'
  },
  {
    id: '3',
    name: 'Maria Oliveira',
    email: 'maria.oliveira@email.com',
    phone: '(11) 99999-3333',
    createdAt: new Date('2024-03-10'),
    totalAppointments: 15,
    lastVisit: new Date('2024-12-12'),
    notes: 'Faz coloração mensalmente, cabelo sensível.'
  },
  {
    id: '4',
    name: 'Pedro Costa',
    email: 'pedro.costa@email.com',
    phone: '(11) 99999-4444',
    createdAt: new Date('2024-11-01'),
    totalAppointments: 2,
    lastVisit: new Date('2024-12-05')
  },
  {
    id: '5',
    name: 'Julia Ferreira',
    email: 'julia.ferreira@email.com',
    phone: '(11) 99999-5555',
    createdAt: new Date('2024-10-15'),
    totalAppointments: 6,
    lastVisit: new Date('2024-11-28'),
    notes: 'Estudante, desconto de 10%.'
  }
];

const initialServices: Service[] = [
  {
    id: '1',
    name: 'Corte Masculino',
    description: 'Corte moderno e estiloso para homens, inclui lavagem e finalização',
    duration: 30,
    price: 35.00,
    category: 'Cabelo',
    isActive: true
  },
  {
    id: '2',
    name: 'Corte Feminino',
    description: 'Corte personalizado para mulheres com lavagem, corte e escova',
    duration: 45,
    price: 50.00,
    category: 'Cabelo',
    isActive: true
  },
  {
    id: '3',
    name: 'Coloração Completa',
    description: 'Tingimento e coloração profissional com produtos de alta qualidade',
    duration: 120,
    price: 120.00,
    category: 'Cabelo',
    isActive: true
  },
  {
    id: '4',
    name: 'Barba Completa',
    description: 'Aparar, modelar e finalizar barba com produtos especializados',
    duration: 20,
    price: 25.00,
    category: 'Barba',
    isActive: true
  },
  {
    id: '5',
    name: 'Manicure',
    description: 'Cuidados completos para as unhas das mãos',
    duration: 40,
    price: 30.00,
    category: 'Unhas',
    isActive: true
  },
  {
    id: '6',
    name: 'Pedicure',
    description: 'Cuidados completos para as unhas dos pés',
    duration: 50,
    price: 35.00,
    category: 'Unhas',
    isActive: true
  },
  {
    id: '7',
    name: 'Escova Progressiva',
    description: 'Tratamento alisante para cabelos cacheados e crespos',
    duration: 180,
    price: 200.00,
    category: 'Cabelo',
    isActive: true
  },
  {
    id: '8',
    name: 'Hidratação Capilar',
    description: 'Tratamento intensivo para cabelos ressecados',
    duration: 60,
    price: 45.00,
    category: 'Cabelo',
    isActive: true
  },
  {
    id: '9',
    name: 'Design de Sobrancelhas',
    description: 'Modelagem e design personalizado de sobrancelhas',
    duration: 30,
    price: 25.00,
    category: 'Sobrancelha',
    isActive: true
  },
  {
    id: '10',
    name: 'Massagem Relaxante',
    description: 'Massagem terapêutica para alívio do estresse',
    duration: 60,
    price: 80.00,
    category: 'Massagem',
    isActive: false
  }
];

const initialAppointments: Appointment[] = [
  {
    id: '1',
    clientId: '1',
    serviceId: '1',
    date: new Date('2024-12-20'),
    time: '09:00',
    status: 'confirmed',
    duration: 30,
    price: 35.00,
    notes: 'Cliente preferiu corte mais conservador'
  },
  {
    id: '2',
    clientId: '2',
    serviceId: '2',
    date: new Date('2024-12-20'),
    time: '10:30',
    status: 'scheduled',
    duration: 45,
    price: 50.00
  },
  {
    id: '3',
    clientId: '3',
    serviceId: '3',
    date: new Date('2024-12-21'),
    time: '14:00',
    status: 'scheduled',
    duration: 120,
    price: 120.00,
    notes: 'Coloração tom chocolate'
  },
  {
    id: '4',
    clientId: '1',
    serviceId: '4',
    date: new Date('2024-12-19'),
    time: '16:00',
    status: 'completed',
    duration: 20,
    price: 25.00,
    rating: 5,
    feedback: 'Excelente atendimento! Muito satisfeito com o resultado.'
  },
  {
    id: '5',
    clientId: '4',
    serviceId: '1',
    date: new Date('2024-12-22'),
    time: '11:00',
    status: 'scheduled',
    duration: 30,
    price: 35.00
  },
  {
    id: '6',
    clientId: '5',
    serviceId: '5',
    date: new Date('2024-12-20'),
    time: '15:30',
    status: 'confirmed',
    duration: 40,
    price: 30.00
  },
  {
    id: '7',
    clientId: '2',
    serviceId: '8',
    date: new Date('2024-12-18'),
    time: '13:00',
    status: 'completed',
    duration: 60,
    price: 45.00,
    rating: 4,
    feedback: 'Muito bom! Cabelo ficou hidratado e brilhoso.'
  },
  {
    id: '8',
    clientId: '3',
    serviceId: '9',
    date: new Date('2024-12-23'),
    time: '10:00',
    status: 'scheduled',
    duration: 30,
    price: 25.00
  }
];

const initialReviews: ClientReview[] = [
  {
    id: '1',
    clientId: '1',
    appointmentId: '4',
    serviceId: '4',
    rating: 5,
    feedback: 'Excelente atendimento! Muito satisfeito com o resultado.',
    date: new Date('2024-12-19'),
    isPublic: true
  },
  {
    id: '2',
    clientId: '2',
    appointmentId: '7',
    serviceId: '8',
    rating: 4,
    feedback: 'Muito bom! Cabelo ficou hidratado e brilhoso.',
    date: new Date('2024-12-18'),
    isPublic: true
  },
  {
    id: '3',
    clientId: '3',
    appointmentId: '3',
    serviceId: '3',
    rating: 5,
    feedback: 'Adorei a cor! Ficou exatamente como eu queria.',
    date: new Date('2024-11-15'),
    isPublic: true
  },
  {
    id: '4',
    clientId: '5',
    appointmentId: '6',
    serviceId: '5',
    rating: 4,
    feedback: 'Ótimo trabalho, unhas ficaram perfeitas!',
    date: new Date('2024-11-28'),
    isPublic: true
  }
];

// Função para inicializar dados se não existirem
const initializeDataIfEmpty = () => {
  if (!localStorage.getItem('mockClients')) {
    localStorage.setItem('mockClients', JSON.stringify(initialClients));
  }
  if (!localStorage.getItem('mockServices')) {
    localStorage.setItem('mockServices', JSON.stringify(initialServices));
  }
  if (!localStorage.getItem('mockAppointments')) {
    localStorage.setItem('mockAppointments', JSON.stringify(initialAppointments));
  }
  if (!localStorage.getItem('clientReviews')) {
    localStorage.setItem('clientReviews', JSON.stringify(initialReviews));
  }
};

// Inicializar dados apenas se não existirem
initializeDataIfEmpty();

// Exportar dados carregados do localStorage
export const mockClients: Client[] = loadFromStorage('mockClients', []);
export const mockServices: Service[] = loadFromStorage('mockServices', []);
export const mockAppointments: Appointment[] = loadFromStorage('mockAppointments', []);
export const clientReviews: ClientReview[] = loadFromStorage('clientReviews', []);

// Calcular estatísticas baseadas nos dados reais
const calculateStats = (): BusinessStats => {
  const appointments = loadFromStorage('mockAppointments', []);
  const clients = loadFromStorage('mockClients', []);
  const reviews = loadFromStorage('clientReviews', []);
  
  const totalRevenue = appointments
    .filter((apt: any) => apt.status === 'completed')
    .reduce((sum: number, apt: any) => sum + (apt.price || 0), 0);
  
  const totalAppointments = appointments.length;
  const totalClients = clients.length;
  
  const today = new Date();
  const todayAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  }).length;
  
  const upcomingAppointments = appointments.filter((apt: any) => {
    const aptDate = new Date(apt.date);
    return aptDate > today && apt.status !== 'cancelled';
  }).length;
  
  // Calcular avaliação média REAL baseada nas avaliações dos clientes
  const avgRating = reviews.length > 0 
    ? reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / reviews.length
    : 0;
  
  return {
    totalRevenue,
    totalAppointments,
    totalClients,
    avgRating,
    upcomingAppointments,
    todayAppointments
  };
};

export const mockStats: BusinessStats = calculateStats();