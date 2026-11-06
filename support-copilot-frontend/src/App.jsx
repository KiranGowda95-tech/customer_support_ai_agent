import { useState } from 'react';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardPage from './features/dashboard/DashboardPage';
import TicketPage from './features/tickets/TicketPage';
import CustomerChatPage from './features/customer-chat/CustomerChatPage';

function App() {
  const [activeItem, setActiveItem] = useState('Dashboard');
  const [portal, setPortal] = useState('agent');

  return (
    <div className='h-dvh flex flex-col'>
      {/* Temporary development portal switch */}
      <div className='h-12 shrink-0 bg-slate-900 text-white flex items-center justify-center gap-3'>
        <button
          onClick={() => setPortal('agent')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium ${
            portal === 'agent' ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          Customer Care Portal
        </button>

        <button
          onClick={() => setPortal('customer')}
          className={`px-4 py-1.5 rounded-lg text-xs font-medium ${
            portal === 'customer' ? 'bg-blue-600' : 'bg-slate-700'
          }`}
        >
          Customer Portal
        </button>
      </div>

      {portal === 'customer' ? (
        <div className='flex-1 min-h-0'>
          <CustomerChatPage />
        </div>
      ) : (
        <div className='flex-1 min-h-0'>
          <DashboardLayout activeItem={activeItem} onNavigate={setActiveItem}>
            {activeItem === 'Dashboard' ? (
              <DashboardPage />
            ) : activeItem === 'Tickets' ? (
              <TicketPage />
            ) : (
              <div className='rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center'>
                <h2 className='font-semibold text-slate-800'>{activeItem}</h2>
                <p className='mt-2 text-sm text-slate-500'>
                  Your {activeItem.toLowerCase()} workspace will appear here.
                </p>
              </div>
            )}
          </DashboardLayout>
        </div>
      )}
    </div>
  );
}

export default App;
