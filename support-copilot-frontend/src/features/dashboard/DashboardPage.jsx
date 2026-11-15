import { Inbox, Clock3, CheckCircle2, Sparkles } from 'lucide-react';

import StatCard from './components/StatCard';
import TicketActivity from './components/TicketActivity';
import RecentTickets from './components/RecentTickets';
import AIOverview from './components/AIOverview';

function DashboardPage() {
  const stats = [
    {
      title: 'Total Tickets',
      value: '1,284',
      change: '+12.5%',
      description: 'vs last month',
      icon: Inbox,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Open Tickets',
      value: '248',
      change: '+4.2%',
      description: 'vs last month',
      icon: Clock3,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'Resolved Tickets',
      value: '986',
      change: '+18.2%',
      description: 'vs last month',
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      title: 'AI Drafts Generated',
      value: '342',
      change: '+8.6%',
      description: 'vs last month',
      icon: Sparkles,
      color: 'bg-violet-50 text-violet-600',
    },
  ];

  return (
    <div className='mx-auto max-w-[1600px]'>
      {/* Welcome */}
      <div className='mb-8 flex flex-wrap items-end justify-between gap-4'>
        <div>
          <p className='mb-2 text-xs font-medium text-slate-400'>
            Thursday, November 5, 2026
          </p>

          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Good morning, Admin 👋
          </h1>

          <p className='mt-2 text-sm text-slate-500'>
            Here's what's happening with your customer support today.
          </p>
        </div>

        <span className='rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-500'>
          Demo dashboard data
        </span>
      </div>

      {/* KPI cards */}
      <div className='mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Analytics */}
      <div className='mb-6 grid grid-cols-1 gap-6 xl:grid-cols-3'>
        <div className='xl:col-span-2'>
          <TicketActivity />
        </div>

        <AIOverview />
      </div>

      {/* Recent tickets */}
      <RecentTickets />
    </div>
  );
}

export default DashboardPage;
