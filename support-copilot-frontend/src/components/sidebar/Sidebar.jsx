import {
  LayoutDashboard,
  Inbox,
  Users,
  BookOpen,
  BrainCircuit,
  ChartNoAxesCombined,
  Settings,
  LifeBuoy,
  Sparkles,
  ChevronDown,
} from 'lucide-react';

import NavItem from './NavItem';

function Sidebar({ activeItem, onNavigate }) {
  const mainNavigation = [
    {
      label: 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      label: 'Tickets',
      icon: Inbox,
      badge: '12',
    },
    {
      label: 'Customers',
      icon: Users,
    },
  ];

  const aiNavigation = [
    {
      label: 'Knowledge Base',
      icon: BookOpen,
    },
    {
      label: 'AI Memory',
      icon: BrainCircuit,
    },
    {
      label: 'Analytics',
      icon: ChartNoAxesCombined,
    },
  ];
  return (
    <aside className='flex h-full min-h-0 w-[250px] shrink-0 flex-col border-r border-slate-200 bg-white '>
      {/* {Brand} */}
      <div className='flex h-[76px] items-center gap-3 border-b border-slate-100 px-6'>
        <div className='flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm shadow-blue-200'>
          <Sparkles size={21} />
        </div>

        <div>
          <h1 className='text-[15px] font-bold tracking-tight text-slate-900'>
            Support Copilot
          </h1>
          <p className='mt-0.5 text-[10px] font-medium tracking-[1.5px] text-slate-400'>
            At Workspace
          </p>
        </div>
      </div>
      {/* {Workspace selection} */}
      <div className='px-4 pt-6'>
        <button className='flex w-full items-center justify-between rounded-lg border border-slate-200 p-3 hover:bg-slate-50'>
          <div className='flex items-center gap-2.5'>
            <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-xs font-bold text-indigo-600'>
              SC
            </div>
            <div className='text-left'>
              <p className='text-xs font-semibold text-slate-800'>
                Support Team{' '}
              </p>
              <p className='text-[10px] text-slate-400'>WorkSpace</p>
            </div>
          </div>
          <ChevronDown size={15} className='text-slate-400' />
        </button>
      </div>

      {/* {Navigation} */}
      <nav className='min-h-0 flex-1 space-y-7 overflow-y-auto px-4 py-7'>
        <div>
          <p className='mb-3 px-3 text-[10px] font-bold tracking-[1.4px] text-slate-400'>
            WORKSPACE
          </p>
          <div className='space-y-1'>
            {mainNavigation.map((item) => (
              <NavItem
                key={item.label}
                {...item}
                active={activeItem === item.label}
                onClick={() => onNavigate(item.label)}
              />
            ))}
          </div>
        </div>
        <div>
          <p className='mb-3 px-3 text-[10px] font-bold tracking-[1.4px] text-slate-400'>
            AI MANAGEMENT
          </p>
          <div className='space-y-1'>
            {aiNavigation.map((item) => (
              <NavItem
                key={item.label}
                {...item}
                active={activeItem === item.label}
                onClick={() => onNavigate(item.label)}
              />
            ))}
          </div>
        </div>
      </nav>
      {/* {Bottom Navigation} */}
      <div className='space-y-1 border-t border-slate-100 px-4 py-4'>
        <NavItem
          icon={Settings}
          label='Settings'
          active={activeItem === 'Settings'}
          onClick={() => onNavigate('Settings')}
        />
        <NavItem
          icon={LifeBuoy}
          label='Help & Support'
          active={activeItem === 'Help & Support'}
          onCLick={() => onNavigate('Help & Support')}
        />
      </div>
      {/* User Profile */}
      <div className='border-t border-slate-100 p-4'>
        <div className='flex items-center gap-3'>
          <div className='flex h-9 w-9 items-center justify-center rounded-full bg-slate-200 text-xs font-bold text-slate-700'>
            KK
          </div>
          <div className='min-w-0 flex-1'>
            <p className='truncate text-xs font-semibold text-slate-800'>
              Support Admin
            </p>
            <p className='truncate text-[10px] text-slate-400'>
              admin@supportcopilot.ai
            </p>
          </div>
          <ChevronDown size={15} className='text-slate-400' />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
