import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import Calendar from './components/Calendar/Calendar';
import Clients from './components/Clients/Clients';
import Leads from './components/Leads/Leads';
import Services from './components/Services/Services';
import TeamManagement from './components/Team/TeamManagement';
import Analytics from './components/Analytics/Analytics';
import Reports from './components/Reports/Reports';
import Notifications from './components/Notifications/Notifications';
import Settings from './components/Settings/Settings';
import { useAutomaticMessaging } from './hooks/useAutomaticMessaging';
import { mockAppointments, mockClients, mockServices } from './data/mockData';

interface AppearanceSettings {
  theme: 'light' | 'dark' | 'system';
  primaryColor: string;
  accentColor: string;
  fontSize: 'small' | 'medium' | 'large';
  fontFamily: 'inter' | 'roboto' | 'poppins' | 'system';
  borderRadius: 'none' | 'small' | 'medium' | 'large';
  animations: boolean;
  compactMode: boolean;
  sidebarStyle: 'default' | 'minimal' | 'floating';
  headerStyle: 'default' | 'compact' | 'prominent';
  cardStyle: 'default' | 'elevated' | 'outlined' | 'minimal';
  colorScheme: 'default' | 'vibrant' | 'pastel' | 'monochrome';
  backgroundPattern: 'none' | 'dots' | 'grid' | 'waves' | 'geometric';
  density: 'comfortable' | 'compact' | 'spacious';
  iconStyle: 'outline' | 'filled' | 'duotone';
  buttonStyle: 'rounded' | 'square' | 'pill';
  shadowIntensity: 'none' | 'subtle' | 'medium' | 'strong';
  accentColorIntensity: 'subtle' | 'medium' | 'vibrant';
}

const defaultAppearanceSettings: AppearanceSettings = {
  theme: 'light',
  primaryColor: '#2563eb',
  accentColor: '#10b981',
  fontSize: 'medium',
  fontFamily: 'inter',
  borderRadius: 'medium',
  animations: true,
  compactMode: false,
  sidebarStyle: 'default',
  headerStyle: 'default',
  cardStyle: 'default',
  colorScheme: 'default',
  backgroundPattern: 'none',
  density: 'comfortable',
  iconStyle: 'outline',
  buttonStyle: 'rounded',
  shadowIntensity: 'medium',
  accentColorIntensity: 'medium'
};

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  // Inicializar sistema de mensagens automáticas
  useAutomaticMessaging(mockAppointments, mockClients, mockServices);

  // Add effect to manage body scroll when modals are open
  useEffect(() => {
    const handleModalState = () => {
      const modals = document.querySelectorAll('.modal-overlay[data-modal-active="true"]');
      if (modals.length > 0) {
        document.body.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
      }
    };

    // Check for modals periodically
    const interval = setInterval(handleModalState, 100);
    
    return () => {
      clearInterval(interval);
      document.body.classList.remove('modal-open');
    };
  }, []);

  // Aplicar configurações de aparência globalmente
  useEffect(() => {
    const applyAppearanceSettings = () => {
      try {
        const stored = localStorage.getItem('appearanceSettings');
        const settings = stored ? { ...defaultAppearanceSettings, ...JSON.parse(stored) } : defaultAppearanceSettings;
        
        const root = document.documentElement;
        const body = document.body;
        
        // Apply colors
        root.style.setProperty('--primary-color', settings.primaryColor);
        root.style.setProperty('--accent-color', settings.accentColor);

        // Apply accent color intensity
        const accentIntensity = {
          subtle: 0.6,
          medium: 0.8,
          vibrant: 1.0
        };
        const intensity = accentIntensity[settings.accentColorIntensity];
       root.style.setProperty('--accent-color-opacity', (intensity ?? 1.0).toString());

        // Apply font size
        const fontSizes = {
          small: '14px',
          medium: '16px',
          large: '18px'
        };
        root.style.setProperty('--base-font-size', fontSizes[settings.fontSize]);

        // Apply font family
        const fontFamilies = {
          inter: '"Inter", sans-serif',
          roboto: '"Roboto", sans-serif',
          poppins: '"Poppins", sans-serif',
          system: 'system-ui, -apple-system, sans-serif'
        };
        root.style.setProperty('--font-family', fontFamilies[settings.fontFamily]);
        
        // Apply font family to body immediately
        document.body.style.fontFamily = fontFamilies[settings.fontFamily];
        document.body.style.fontSize = fontSizes[settings.fontSize];

        // Apply border radius
        const borderRadii = {
          none: '0px',
          small: '4px',
          medium: '8px',
          large: '16px'
        };
        root.style.setProperty('--border-radius', borderRadii[settings.borderRadius]);

        // Apply animations
        root.style.setProperty('--animation-duration', settings.animations ? '0.2s' : '0s');

        // Apply compact mode
        if (settings.compactMode) {
          body.classList.add('compact-mode');
        } else {
          body.classList.remove('compact-mode');
        }

        // Apply density classes (only when not default)
        body.classList.remove('density-compact', 'density-spacious');
        if (settings.density === 'compact') {
          body.classList.add('density-compact');
        } else if (settings.density === 'spacious') {
          body.classList.add('density-spacious');
        }

        // Apply density scale
        const densityScales = {
          compact: '0.8',
          comfortable: '1',
          spacious: '1.2'
        };
        root.style.setProperty('--spacing-scale', densityScales[settings.density]);

        // Apply shadow intensity
        const shadowIntensities = {
          none: '0 0 0 0 rgba(0, 0, 0, 0)',
          subtle: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
          medium: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
          strong: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
        };
        root.style.setProperty('--shadow-intensity', shadowIntensities[settings.shadowIntensity]);
        
        // Apply shadow class only when not default
        if (settings.shadowIntensity !== 'medium') {
          body.classList.add('appearance-shadow');
        } else {
          body.classList.remove('appearance-shadow');
        }

        // Apply button style
        const buttonStyles = {
          rounded: '8px',
          square: '4px',
          pill: '9999px'
        };
        root.style.setProperty('--button-radius', buttonStyles[settings.buttonStyle]);
        
        // Apply button style classes
        body.classList.remove('button-rounded', 'button-square', 'button-pill');
        body.classList.add(`button-${settings.buttonStyle}`);

        // Remove all style classes first
        const styleClasses = [
          'sidebar-minimal', 'sidebar-floating',
          'header-compact', 'header-prominent',
          'cards-elevated', 'cards-outlined', 'cards-minimal',
          'scheme-vibrant', 'scheme-pastel', 'scheme-monochrome',
          'icons-filled', 'icons-duotone'
        ];
        body.classList.remove(...styleClasses);

        // Apply sidebar style (only when not default)
        if (settings.sidebarStyle === 'minimal') {
          body.classList.add('sidebar-minimal');
        } else if (settings.sidebarStyle === 'floating') {
          body.classList.add('sidebar-floating');
          // Reset floating state classes when style changes
          body.classList.remove('sidebar-floating-open', 'sidebar-floating-closed');
        }

        // Apply header style (only when not default)
        if (settings.headerStyle === 'compact') {
          body.classList.add('header-compact');
        } else if (settings.headerStyle === 'prominent') {
          body.classList.add('header-prominent');
        }

        // Apply card style (only when not default)
        if (settings.cardStyle === 'elevated') {
          body.classList.add('cards-elevated');
        } else if (settings.cardStyle === 'outlined') {
          body.classList.add('cards-outlined');
        } else if (settings.cardStyle === 'minimal') {
          body.classList.add('cards-minimal');
        }

        // Apply color scheme (only when not default)
        if (settings.colorScheme === 'vibrant') {
          body.classList.add('scheme-vibrant');
        } else if (settings.colorScheme === 'pastel') {
          body.classList.add('scheme-pastel');
        } else if (settings.colorScheme === 'monochrome') {
          body.classList.add('scheme-monochrome');
        }

        // Apply icon style (only when not default)
        if (settings.iconStyle === 'filled') {
          body.classList.add('icons-filled');
        } else if (settings.iconStyle === 'duotone') {
          body.classList.add('icons-duotone');
        }

        // Apply background pattern
        applyBackgroundPattern(settings.backgroundPattern);

        // Apply theme with proper class management
        applyTheme(settings.theme);
      } catch (error) {
        console.error('Error applying appearance settings:', error);
      }
    };

    const applyBackgroundPattern = (pattern: string) => {
      const body = document.body;
      
      // Remove existing pattern classes
      body.classList.remove('bg-pattern-dots', 'bg-pattern-grid', 'bg-pattern-waves', 'bg-pattern-geometric');
      
      if (pattern !== 'none') {
        body.classList.add(`bg-pattern-${pattern}`);
      }
    };

    const applyTheme = (theme: 'light' | 'dark' | 'system') => {
      const html = document.documentElement;
      const body = document.body;
      
      // Remove existing theme classes
      html.classList.remove('dark');
      body.classList.remove('dark');
      
      if (theme === 'dark') {
        html.classList.add('dark');
        body.classList.add('dark');
      } else if (theme === 'light') {
        // Light theme is default, no class needed
      } else if (theme === 'system') {
        // Check system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          html.classList.add('dark');
          body.classList.add('dark');
        }
        
        // Listen for system theme changes
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
          if (theme === 'system') { // Only apply if still in system mode
            if (e.matches) {
              html.classList.add('dark');
              body.classList.add('dark');
            } else {
              html.classList.remove('dark');
              body.classList.remove('dark');
            }
          }
        };
        
        mediaQuery.addEventListener('change', handleSystemThemeChange);
        
        // Store cleanup function
        return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
      }
    };

    // Apply settings on mount
    const cleanup = applyAppearanceSettings();

    // Listen for storage changes to update settings in real-time
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'appearanceSettings') {
        applyAppearanceSettings();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Listen for custom events from the appearance settings component
    const handleAppearanceUpdate = () => {
      applyAppearanceSettings();
    };

    window.addEventListener('appearanceSettingsUpdated', handleAppearanceUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('appearanceSettingsUpdated', handleAppearanceUpdate);
      if (cleanup) cleanup();
    };
  }, []);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'calendar':
        return <Calendar />;
      case 'clients':
        return <Clients />;
      case 'leads':
        return <Leads />;
      case 'services':
        return <Services />;
      case 'team':
        return <TeamManagement />;
      case 'analytics':
        return <Analytics />;
      case 'reports':
        return <Reports />;
      case 'notifications':
        return <Notifications />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 transition-colors duration-300">
      <Sidebar
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      
      <div className="lg:pl-64">
        <Header 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)}
          onSectionChange={setActiveSection}
        />
        <main className="flex-1">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;