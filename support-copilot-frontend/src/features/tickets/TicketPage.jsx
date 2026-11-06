import { useMemo, useState } from 'react';

import { Inbox, Clock3, CheckCircle2, AlertCircle, Plus } from 'lucide-react';

import { ticketData } from './data/ticketData';

import TicketFilters from './components/TicketFilters';
import TicketTable from './components/TicketTable';
import TicketConversation from './components/TicketConversation';

function TicketPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [priority, setPriority] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const pageSize = 5;

  // Calculate ticket summary
  const stats = [
    {
      title: 'Total Tickets',
      value: ticketData.length,
      icon: Inbox,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Open Tickets',
      value: ticketData.filter((t) => t.status === 'Open').length,
      icon: AlertCircle,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'In Progress',
      value: ticketData.filter((t) => t.status === 'In Progress').length,
      icon: Clock3,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Resolved',
      value: ticketData.filter((t) => t.status === 'Resolved').length,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  // Search and filter tickets
  const filteredTickets = useMemo(() => {
    return ticketData.filter((ticket) => {
      const query = search.toLowerCase().trim();

      const matchesSearch =
        ticket.id.toLowerCase().includes(query) ||
        ticket.customer.toLowerCase().includes(query) ||
        ticket.subject.toLowerCase().includes(query) ||
        ticket.email.toLowerCase().includes(query);

      const matchesStatus = status === 'All' || ticket.status === status;

      const matchesPriority =
        priority === 'All' || ticket.priority === priority;

      return matchesSearch && matchesStatus && matchesPriority;
    });
  }, [search, status, priority]);

  // Pagination
  const totalPages = Math.max(1, Math.ceil(filteredTickets.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedTickets = filteredTickets.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize,
  );

  const resetFilters = () => {
    setSearch('');
    setStatus('All');
    setPriority('All');
    setCurrentPage(1);
  };

  if (selectedTicket) {
    return (
      <TicketConversation
        ticket={selectedTicket}
        onBack={() => setSelectedTicket(null)}
      />
    );
  }

  return (
    <div className='mx-auto max-w-[1600px]'>
      {/* Page heading */}
      <div className='mb-7 flex flex-wrap items-center justify-between gap-4'>
        <div>
          <p className='mb-2 text-xs font-medium text-slate-400'>
            Workspace / Ticket Management
          </p>

          <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
            Tickets
          </h1>

          <p className='mt-2 text-sm text-slate-500'>
            Manage, track and resolve customer support requests.
          </p>
        </div>

        <button className='flex h-10 items-center gap-2 rounded-lg bg-blue-600 px-4 text-sm font-semibold text-white transition hover:bg-blue-700'>
          <Plus size={17} />
          Create Ticket
        </button>
      </div>

      {/* Summary cards */}
      <div className='mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className='rounded-xl border border-slate-200 bg-white p-5'
            >
              <div className='flex items-center justify-between'>
                <p className='text-xs font-medium text-slate-500'>
                  {stat.title}
                </p>

                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon size={18} />
                </div>
              </div>

              <h2 className='mt-3 text-2xl font-bold text-slate-900'>
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Ticket list */}
      <section className='space-y-4'>
        <div>
          <h2 className='text-base font-semibold text-slate-900'>
            All Support Tickets
          </h2>

          <p className='mt-1 text-xs text-slate-400'>
            Search and manage your customer requests.
          </p>
        </div>

        <TicketFilters
          search={search}
          setSearch={(value) => {
            setSearch(value);
            setCurrentPage(1);
          }}
          status={status}
          setStatus={(value) => {
            setStatus(value);
            setCurrentPage(1);
          }}
          priority={priority}
          setPriority={(value) => {
            setPriority(value);
            setCurrentPage(1);
          }}
          onReset={resetFilters}
        />

        <TicketTable
          tickets={paginatedTickets}
          currentPage={safePage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          totalResults={filteredTickets.length}
          pageSize={pageSize}
          onSelectTicket={setSelectedTicket}
        />
      </section>
    </div>
  );
}

export default TicketPage;
