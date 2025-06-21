import React, { useState, useEffect, Suspense } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import Dashboard from './Dashboard';
import LoadingSpinner from './LoadingSpinner';

// Lazy load dos módulos
const CalendarModule = React.lazy(() => import('../../appointments/components/Calendar'));
const ClientsModule = React.lazy(() => import('../../clients/components/Clients'));
const LeadsModule = React.lazy(() => import('../../leads/components/Leads'));
const ServicesModule = React.lazy(() => import('../../services/components/Services'));
const TeamModule = React.lazy(() => import('../../team/components/TeamManagement'));
const AnalyticsModule = React.lazy(() => import('../../analytics/components/Analytics'));
const ReportsModule = React.lazy(() => import('../../reports/components/Reports'));
const NotificationsModule = React.lazy(() => import('../../notifications/components/Notifications'));
const SettingsModule = React.lazy(() => import('../../settings/components/Settings'));

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    const content = (() => {
      switch (activeSection) {
        case 'dashboard':
          return <Dashboard />;
        case 'calendar':
          return <CalendarModule />;
        case 'clients':
          return <ClientsModule />;
        case 'leads':
          return <LeadsModule />;
        case 'services':
          return <ServicesModule />;
        case 'team':
          return <TeamModule />;
        case 'analytics':
          return <AnalyticsModule />;
        case 'reports':
          return <ReportsModule />;
        case 'notifications':
          return <NotificationsModule />;
        case 'settings':
          return <SettingsModule />;
        default:
          return <Dashboard />;
      }
    })();

    return (
      <Suspense fallback={<LoadingSpinner />}>
        {content}
      </Suspense>
    );
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