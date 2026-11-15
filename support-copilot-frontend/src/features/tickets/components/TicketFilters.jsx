import { Search, SlidersHorizontal, X } from 'lucide-react';

function TicketFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  onReset,
}) {
  return (
    <div className='flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between'>
      {/* Search */}
      <div className='relative w-full lg:max-w-md'>
        <Search
          size={17}
          className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
        />

        <input
          type='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder='Search by ticket ID, customer or subject...'
          className='h-10 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100'
        />
      </div>

      {/* Filters */}
      <div className='flex flex-wrap items-center gap-2'>
        <span className='flex items-center gap-1.5 text-xs font-medium text-slate-500'>
          <SlidersHorizontal size={15} />
          Filters
        </span>

        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none focus:border-blue-400'
        >
          <option value='All'>All statuses</option>
          <option value='Open'>Open</option>
          <option value='In Progress'>In Progress</option>
          <option value='Resolved'>Resolved</option>
        </select>

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className='h-10 rounded-lg border border-slate-200 bg-white px-3 text-xs font-medium text-slate-600 outline-none focus:border-blue-400'
        >
          <option value='All'>All priorities</option>
          <option value='High'>High</option>
          <option value='Medium'>Medium</option>
          <option value='Low'>Low</option>
        </select>

        {(search || status !== 'All' || priority !== 'All') && (
          <button
            onClick={onReset}
            className='flex h-10 items-center gap-1 rounded-lg px-3 text-xs font-medium text-slate-500 hover:bg-slate-100 hover:text-slate-800'
          >
            <X size={14} />
            Clear
          </button>
        )}
      </div>
    </div>
  );
}

export default TicketFilters;
