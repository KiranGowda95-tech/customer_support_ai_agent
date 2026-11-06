import { Search, Bell, Plus, ChevronRight } from 'lucide-react';

function Topbar({ title }) {
  return (
    <header className='flex h-[76px] items-center justify-between border-b border-slate-200 bg-white px-8'>
      <div className='flex items-center gap-2 text-sm'>
        <span className='text-slate-400'>Workspace</span>
        <ChevronRight size={14} className='text-slate-300' />
        <span className='font-semibold text-slte-800'>{title}</span>
      </div>
      <div className='flex items-center gap-4'>
        <div className='flex h-9 w-[240px] items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3'>
          <Search size={16} className='text-slates-400' />
          <inut
            type='text'
            placeholder='Search anything...'
            className='w-full bg-transparent text-xs outline-none placeholder:text-slate-400'
          />
          <span className='rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[9px] text-slate-400'>
            /
          </span>
        </div>
        <button className='flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-3 text-xs font-semibold text-white transition hover:bg-blue-700'>
          <Plus size={15} />
          Create Ticket
        </button>
        <button
          aria-label='Notifications'
          className='relative flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50'
        >
          <Bell size={17} />
          <span className='absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-500 ring-2 ring-white' />
        </button>
      </div>
    </header>
  );
}

export default Topbar;
