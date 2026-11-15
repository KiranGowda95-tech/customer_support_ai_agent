import { useEffect, useState } from 'react';
import { Inbox, Clock3, CheckCircle2, AlertCircle } from 'lucide-react';

import { useSupportChat } from '../customer-chat/useSupportChat';
import ConversationInbox from './ConversationInbox';
import TicketConversation from './components/TicketConversation';

function TicketPage() {
  const {
    tickets,
    refreshTickets,
    loadMessages,
    activeCustomerTicketId,
    setActiveCustomerTicketId,
  } = useSupportChat();

  const [selectedTicket, setSelectedTicket] = useState(null);

  // Automatically select the newest ticket when the inbox opens.
  useEffect(() => {
    if (tickets.length === 0) return;

    if (!selectedTicket) {
      const sharedTicket = tickets.find(
        (ticket) => String(ticket.id) === String(activeCustomerTicketId),
      );

      const ticketToSelect = sharedTicket || tickets[0];

      setSelectedTicket(ticketToSelect);
      setActiveCustomerTicketId(ticketToSelect.id);
    }
  }, [
    tickets,
    selectedTicket,
    activeCustomerTicketId,
    setActiveCustomerTicketId,
  ]);

  // Refresh the ticket list every 15 seconds.
  useEffect(() => {
    const intervalId = setInterval(() => {
      refreshTickets();
    }, 15000);

    return () => clearInterval(intervalId);
  }, [refreshTickets]);

  // Refresh messages only for the selected conversation.
  useEffect(() => {
    if (!selectedTicket?.id) return;

    loadMessages(selectedTicket.id).catch((error) => {
      console.error('Failed to load selected conversation:', error);
    });

    const intervalId = setInterval(() => {
      loadMessages(selectedTicket.id).catch((error) => {
        console.error('Failed to refresh selected conversation:', error);
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [selectedTicket?.id, loadMessages]);

  const stats = [
    {
      title: 'Total Conversations',
      value: tickets.length,
      icon: Inbox,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Open',
      value: tickets.filter((t) => t.status === 'Open').length,
      icon: AlertCircle,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      title: 'In Progress',
      value: tickets.filter((t) => t.status === 'In Progress').length,
      icon: Clock3,
      color: 'bg-violet-50 text-violet-600',
    },
    {
      title: 'Resolved',
      value: tickets.filter((t) => t.status === 'Resolved').length,
      icon: CheckCircle2,
      color: 'bg-emerald-50 text-emerald-600',
    },
  ];

  return (
    <div className='mx-auto max-w-[1600px] space-y-6'>
      <div>
        <p className='mb-2 text-xs font-medium text-slate-400'>
          Workspace / Customer Support
        </p>

        <h1 className='text-2xl font-bold tracking-tight text-slate-900'>
          Conversations
        </h1>

        <p className='mt-2 text-sm text-slate-500'>
          Manage customer conversations and respond with AI assistance.
        </p>
      </div>

      <div className='grid grid-cols-2 gap-3 xl:grid-cols-4'>
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.title}
              className='rounded-xl border border-slate-200 bg-white p-4'
            >
              <div className='flex items-center justify-between gap-2'>
                <p className='text-xs font-medium text-slate-500'>
                  {stat.title}
                </p>

                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg ${stat.color}`}
                >
                  <Icon size={16} />
                </div>
              </div>

              <h2 className='mt-3 text-2xl font-bold text-slate-900'>
                {stat.value}
              </h2>
            </div>
          );
        })}
      </div>

      <div className='grid items-stretch gap-4 xl:grid-cols-[320px_minmax(0,1fr)]'>
        <ConversationInbox
          selectedTicket={selectedTicket}
          onSelectTicket={(ticket) => {
            setSelectedTicket(ticket);
            setActiveCustomerTicketId(ticket.id);
          }}
        />

        <div className='min-w-0'>
          {selectedTicket ? (
            <TicketConversation
              ticket={selectedTicket}
              onBack={() => setSelectedTicket(null)}
            />
          ) : (
            <div className='flex min-h-[650px] flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white text-center'>
              <Inbox size={36} className='text-slate-300' />

              <h2 className='mt-4 text-sm font-semibold text-slate-700'>
                Select a conversation
              </h2>

              <p className='mt-2 text-xs text-slate-400'>
                Choose a customer from the inbox to view their messages.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default TicketPage;
