import { ArrowUpRight } from 'lucide-react';

const tickets = [
  {
    id: 'TKT-1042',
    customer: 'Rahul Sharma',
    subject: 'Payment deducted but order not confirmed',
    status: 'Open',
    priority: 'High',
    time: '12 min ago',
  },
  {
    id: 'TKT-1041',
    customer: 'Priya Nair',
    subject: 'Unable to reset account password',
    status: 'In Progress',
    priority: 'Medium',
    time: '35 min ago',
  },
  {
    id: 'TKT-1040',
    customer: 'Arjun Kumar',
    subject: 'Request for invoice correction',
    status: 'Resolved',
    priority: 'Low',
    time: '1 hour ago',
  },
  {
    id: 'TKT-1039',
    customer: 'Sneha Reddy',
    subject: 'Product delivery is delayed',
    status: 'Open',
    priority: 'High',
    time: '2 hours ago',
  },
];

const statusStyles = {
  Open: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  Resolved: 'bg-emerald-50 text-emerald-700',
};

const priorityStyles = {
  High: 'text-red-600',
  Medium: 'text-amber-600',
  Low: 'text-slate-500',
};

function RecentTickets() {
  return (
    <section className='rounded-xl border border-slate-200 bg-white'>
      <div className='flex items-center justify-between border-b border-slate-100 p-5'>
        <div>
          <h2 className='text-base font-semibold text-slate-900'>
            Recent Tickets
          </h2>

          <p className='mt-1 text-xs text-slate-400'>
            Latest customer support requests · Demo data
          </p>
        </div>

        <button className='flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700'>
          View all
          <ArrowUpRight size={14} />
        </button>
      </div>

      <div className='overflow-x-auto'>
        <table className='w-full min-w-[650px] text-left'>
          <thead className='bg-slate-50'>
            <tr className='text-[11px] font-semibold uppercase tracking-wider text-slate-400'>
              <th className='px-5 py-3'>Ticket</th>
              <th className='px-5 py-3'>Customer</th>
              <th className='px-5 py-3'>Status</th>
              <th className='px-5 py-3'>Priority</th>
              <th className='px-5 py-3'>Created</th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100'>
            {tickets.map((ticket) => (
              <tr key={ticket.id} className='transition hover:bg-slate-50'>
                <td className='px-5 py-4'>
                  <p className='text-xs font-semibold text-blue-600'>
                    {ticket.id}
                  </p>
                  <p className='mt-1 text-xs text-slate-500'>
                    {ticket.subject}
                  </p>
                </td>

                <td className='px-5 py-4 text-xs font-medium text-slate-700'>
                  {ticket.customer}
                </td>

                <td className='px-5 py-4'>
                  <span
                    className={`rounded-md px-2.5 py-1 text-[10px] font-semibold ${statusStyles[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                </td>

                <td
                  className={`px-5 py-4 text-xs font-semibold ${priorityStyles[ticket.priority]}`}
                >
                  {ticket.priority}
                </td>

                <td className='px-5 py-4 text-xs text-slate-400'>
                  {ticket.time}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

export default RecentTickets;
