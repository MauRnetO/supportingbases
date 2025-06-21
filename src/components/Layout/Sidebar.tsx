import React from 'react';
import { 
  Calendar, 
  Users, 
  Briefcase, 
  BarChart3, 
  Settings, 
  Menu,
  X,
  Home,
  Bell,
  FileText,
  CheckSquare,
  UserCheck
} from 'lucide-react';
import { useLocalStorage } from '../../hooks/useLocalStorage';

interface BusinessSettings {
  name: string;
  brandName: string;
  brandLogo?: string;
  phone: string;
  address: string;
  description: string;
}

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Painel', icon: Home },
  { id: 'calendar', name: 'Calendário', icon: Calendar },
  { id: 'clients', name: 'Clientes', icon: Users },
  { id: 'leads', name: 'Leads', icon: UserCheck },
  { id: 'services', name: 'Serviços', icon: Briefcase },
  { id: 'team', name: 'Equipe', icon: CheckSquare },
  { id: 'analytics', name: 'Análises', icon: BarChart3 },
  { id: 'reports', name: 'Relatórios', icon: FileText },
  { id: 'notifications', name: 'Notificações', icon: Bell },
  { id: 'settings', name: 'Configurações', icon: Settings },
];

export default function Sidebar({ isOpen, onToggle, activeSection, onSectionChange }: SidebarProps) {
  const [isFloating, setIsFloating] = React.useState(false);
  const [brandSettings, setBrandSettings] = React.useState({
    brandName: 'AgendaPro',
    brandLogo: ''
  });
  
  // Carregar configurações do negócio para obter marca personalizada
  const [businessSettings] = useLocalStorage<BusinessSettings>('businessSettings', {
    name: 'Salão Belle Époque',
    brandName: 'AgendaPro',
    brandLogo: '',
    phone: '(11) 3333-4444',
    address: 'Rua das Flores, 123 - Centro, São Paulo - SP',
    description: 'Salão de beleza especializado em cortes modernos e tratamentos capilares.'
  });

  // Atualizar configurações da marca localmente quando carregadas
  React.useEffect(() => {
    setBrandSettings({
      brandName: businessSettings.brandName,
      brandLogo: businessSettings.brandLogo || ''
    });
  }, [businessSettings.brandName, businessSettings.brandLogo]);

  // Escutar mudanças nas configurações de negócio
  React.useEffect(() => {
    const handleBusinessSettingsUpdate = (event: CustomEvent) => {
      const updatedSettings = event.detail;
      setBrandSettings({
        brandName: updatedSettings.brandName || 'AgendaPro',
        brandLogo: updatedSettings.brandLogo || ''
      });
    };

    window.addEventListener('businessSettingsUpdated', handleBusinessSettingsUpdate as EventListener);
    
    return () => {
      window.removeEventListener('businessSettingsUpdated', handleBusinessSettingsUpdate as EventListener);
    };
  }, []);

  // Aplicar classes dinâmicas baseadas no estado e estilo da sidebar
  React.useEffect(() => {
    const body = document.body;
    const floating = body.classList.contains('sidebar-floating');
    setIsFloating(floating);
    
    if (floating) {
      if (isOpen) {
        body.classList.add('sidebar-floating-open');
        body.classList.remove('sidebar-floating-closed');
      } else {
        body.classList.add('sidebar-floating-closed');
        body.classList.remove('sidebar-floating-open');
      }
    } else {
      body.classList.remove('sidebar-floating-open', 'sidebar-floating-closed');
    }
  }, [isOpen]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    onToggle();
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className={`fixed inset-0 bg-black transition-opacity duration-300 ${
            isFloating 
              ? 'bg-opacity-30 z-10' 
              : 'bg-opacity-50 z-10 lg:hidden'
          }`}
          onClick={handleOverlayClick}
        />
      )}
      
      {/* Sidebar principal */}
      <aside className={`
        fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0 lg:static lg:shadow-none
        w-64 border-r border-gray-200
        ${isFloating ? 'z-50' : 'z-40'}
      `}>
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
              {brandSettings.brandLogo ? (
                <img 
                  src={brandSettings.brandLogo} 
                  alt="Logo da marca"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Calendar className="w-9 h-9 text-white" />
              )}
            </div>
            <span className="text-xl font-bold text-gray-900 transition-opacity duration-300">
              {brandSettings.brandName}
            </span>
          </div>
          <button
            onClick={onToggle}
            className="lg:hidden p-1 rounded-md hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <nav className="mt-6 relative">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <div key={item.id} className="relative group">
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`
                    w-full flex items-center px-6 py-3 text-left transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border-r-2 border-blue-600' 
                      : 'text-gray-700 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 mr-3 ${isActive ? 'text-blue-600' : 'text-gray-400'}`} />
                  <span className="font-medium transition-opacity duration-300">{item.name}</span>
                </button>
                
                {/* Tooltip para modo minimal */}
                <div className={`
                  absolute left-full top-1/2 transform -translate-y-1/2 ml-2
                  bg-gray-900 text-white text-sm px-3 py-2 rounded-lg shadow-lg
                  opacity-0 invisible group-hover:opacity-100 group-hover:visible
                  transition-all duration-200 z-60 pointer-events-none
                  sidebar-minimal:block hidden
                `}>
                  {item.name}
                  <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-4 border-transparent border-r-gray-900"></div>
                </div>
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}