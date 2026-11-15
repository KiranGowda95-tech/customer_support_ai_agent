import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

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

function TicketTable({
  tickets,
  currentPage,
  totalPages,
  setCurrentPage,
  totalResults,
  pageSize,
  onSelectTicket,
}) {
  const start = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;

  const end = Math.min(currentPage * pageSize, totalResults);

  return (
    <div className='overflow-hidden rounded-xl border border-slate-200 bg-white'>
      <div className='overflow-x-auto'>
        <table className='w-full min-w-[850px] text-left'>
          <thead className='bg-slate-50'>
            <tr className='text-[11px] font-semibold uppercase tracking-wider text-slate-400'>
              <th className='px-5 py-4'>Ticket</th>
              <th className='px-5 py-4'>Customer</th>
              <th className='px-5 py-4'>Category</th>
              <th className='px-5 py-4'>Status</th>
              <th className='px-5 py-4'>Priority</th>
              <th className='px-5 py-4'>Assigned To</th>
              <th className='px-5 py-4'>Created</th>
              <th className='px-5 py-4'></th>
            </tr>
          </thead>

          <tbody className='divide-y divide-slate-100'>
            {tickets.length > 0 ? (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  onClick={() => onSelectTicket(ticket)}
                  className='cursor-pointer transition hover:bg-blue-50/50'
                >
                  <td className='px-5 py-4'>
                    <p className='text-xs font-semibold text-blue-600'>
                      {ticket.id}
                    </p>

                    <p className='mt-1 max-w-[220px] truncate text-xs text-slate-500'>
                      {ticket.subject}
                    </p>
                  </td>

                  <td className='px-5 py-4'>
                    <p className='text-xs font-semibold text-slate-800'>
                      {ticket.customer}
                    </p>

                    <p className='mt-1 text-[10px] text-slate-400'>
                      {ticket.email}
                    </p>
                  </td>

                  <td className='px-5 py-4'>
                    <span className='text-xs text-slate-600'>
                      {ticket.category}
                    </span>
                  </td>

                  <td className='px-5 py-4'>
                    <span
                      className={`whitespace-nowrap rounded-md px-2.5 py-1 text-[10px] font-semibold ${statusStyles[ticket.status]}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  <td className='px-5 py-4'>
                    <span
                      className={`text-xs font-semibold ${priorityStyles[ticket.priority]}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  <td className='px-5 py-4 text-xs text-slate-600'>
                    {ticket.assignedTo}
                  </td>

                  <td className='px-5 py-4 whitespace-nowrap text-xs text-slate-500'>
                    {ticket.createdAt}
                  </td>

                  <td className='px-5 py-4'>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`More actions for ${ticket.id}`}
                      className='rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700'
                    >
                      <MoreHorizontal size={17} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan='8' className='px-5 py-16 text-center'>
                  <p className='text-sm font-semibold text-slate-700'>
                    No tickets found
                  </p>

                  <p className='mt-1 text-xs text-slate-400'>
                    Try changing your search or filters.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className='flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-5 py-4'>
        <p className='text-xs text-slate-500'>
          Showing{' '}
          <span className='font-semibold text-slate-800'>
            {start}-{end}
          </span>{' '}
          of{' '}
          <span className='font-semibold text-slate-800'>{totalResults}</span>{' '}
          tickets
        </p>

        <div className='flex items-center gap-2'>
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((page) => page - 1)}
            className='flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span className='px-2 text-xs font-medium text-slate-600'>
            {currentPage} / {totalPages}
          </span>

          <button
            disabled={currentPage >= totalPages}
            onClick={() => setCurrentPage((page) => page + 1)}
            className='flex h-8 items-center gap-1 rounded-lg border border-slate-200 px-3 text-xs text-slate-600 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40'
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TicketTable;
