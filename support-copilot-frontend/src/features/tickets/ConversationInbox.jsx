import { useMemo, useState } from 'react';
import { Search, MessageCircle, UserRound } from 'lucide-react';
import { useSupportChat } from '../customer-chat/useSupportChat';

const statusStyles = {
  Open: 'bg-blue-50 text-blue-700',
  'In Progress': 'bg-amber-50 text-amber-700',
  Resolved: 'bg-emerald-50 text-emerald-700',
};

function ConversationInbox({ selectedTicket, onSelectTicket }) {
  const { tickets, getMessages } = useSupportChat();
  const [search, setSearch] = useState('');

  const filteredTickets = useMemo(() => {
    const query = search.toLowerCase().trim();

    return tickets.filter((ticket) => {
      return (
        ticket.customer?.toLowerCase().includes(query) ||
        ticket.email?.toLowerCase().includes(query) ||
        ticket.subject?.toLowerCase().includes(query) ||
        String(ticket.id).toLowerCase().includes(query)
      );
    });
  }, [tickets, search]);

  return (
    <section className='flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white'>
      {/* Inbox header */}
      <div className='border-b border-slate-100 p-4'>
        <div className='flex items-center justify-between'>
          <div>
            <h2 className='text-sm font-semibold text-slate-900'>
              Conversations
            </h2>
            <p className='mt-1 text-xs text-slate-400'>
              {tickets.length} total conversations
            </p>
          </div>

          <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600'>
            <MessageCircle size={18} />
          </div>
        </div>

        {/* Search */}
        <div className='relative mt-4'>
          <Search
            size={16}
            className='absolute left-3 top-1/2 -translate-y-1/2 text-slate-400'
          />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder='Search conversations...'
            className='h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-3 text-xs outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50'
          />
        </div>
      </div>

      {/* Conversation list */}
      <div className='min-h-0 flex-1 overflow-y-auto'>
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => {
            const messages = getMessages(ticket.id);
            const latestMessage = messages[messages.length - 1];

            const preview =
              latestMessage?.content || ticket.description || ticket.subject;

            const isSelected = selectedTicket?.id === ticket.id;

            return (
              <button
                key={ticket.id}
                type='button'
                onClick={() => onSelectTicket(ticket)}
                className={`w-full border-b border-slate-100 p-4 text-left transition ${
                  isSelected
                    ? 'bg-blue-50/80 border-l-[3px] border-l-blue-600'
                    : 'hover:bg-slate-50 border-l-[3px] border-l-transparent'
                }`}
              >
                <div className='flex items-start gap-3'>
                  <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-600'>
                    <UserRound size={18} />
                  </div>

                  <div className='min-w-0 flex-1'>
                    <div className='flex items-center justify-between gap-2'>
                      <h3 className='truncate text-xs font-semibold text-slate-800'>
                        {ticket.customer}
                      </h3>

                      <span className='shrink-0 text-[10px] text-slate-400'>
                        {latestMessage?.time || ticket.createdAt}
                      </span>
                    </div>

                    <p className='mt-1 truncate text-[11px] font-medium text-slate-600'>
                      {ticket.subject}
                    </p>

                    <p className='mt-1 truncate text-[11px] text-slate-400'>
                      {latestMessage
                        ? `${latestMessage.sender === 'agent' ? 'You: ' : ''}${preview}`
                        : preview}
                    </p>

                    <div className='mt-2 flex items-center justify-between gap-2'>
                      <span className='text-[10px] text-slate-400'>
                        {ticket.id}
                      </span>

                      <span
                        className={`rounded-md px-2 py-1 text-[9px] font-semibold ${
                          statusStyles[ticket.status] ||
                          'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })
        ) : (
          <div className='px-4 py-12 text-center'>
            <MessageCircle size={24} className='mx-auto text-slate-300' />
            <p className='mt-3 text-xs font-semibold text-slate-600'>
              No conversations found
            </p>
            <p className='mt-1 text-[11px] text-slate-400'>
              Try another customer name or ticket ID.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

export default ConversationInbox;
