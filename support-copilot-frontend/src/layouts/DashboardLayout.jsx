import Sidebar from '../components/sidebar/Sidebar';
import Topbar from '../components/common/Topbar';

function DashboardLayout({ activeItem, onNavigate, children }) {
  return (
    <div className='flex h-dvh w-full overflow-hidden bg-slate-50'>
      {/* Fixed sidebar */}
      <Sidebar activeItem={activeItem} onNavigate={onNavigate} />

      {/* Main application area */}
      <div className='flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden'>
        {/* Fixed topbar */}
        <div className='shrink-0'>
          <Topbar title={activeItem} />
        </div>

        {/* Independently scrollable content */}
        <main className='min-h-0 flex-1 overflow-y-auto overflow-x-hidden p-8'>
          <div className='mx-auto w-full max-w-[1600px]'>{children}</div>
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
