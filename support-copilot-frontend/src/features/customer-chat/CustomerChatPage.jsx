import { useEffect, useState } from 'react';
import { useSupportChat } from './useSupportChat';

import {
  MessageCircle,
  Send,
  Headset,
  ShieldCheck,
  Paperclip,
  Plus,
  ArrowLeft,
} from 'lucide-react';

function CustomerChatTempPage() {
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const {
    tickets,
    activeCustomerTicketId,
    addCustomerTicket,
    addMessage,
    getMessages,
    loadMessages,
  } = useSupportChat();

  const activeTicket = tickets.find(
    (ticket) => String(ticket.id) === String(activeCustomerTicketId),
  );

  const messages = activeCustomerTicketId
    ? getMessages(activeCustomerTicketId)
    : [];

  // Load and refresh only the active customer conversation.
  useEffect(() => {
    if (!activeCustomerTicketId) return;

    loadMessages(activeCustomerTicketId).catch((error) => {
      console.error('Failed to load customer conversation:', error);
    });

    const intervalId = setInterval(() => {
      loadMessages(activeCustomerTicketId).catch((error) => {
        console.error('Failed to refresh customer conversation:', error);
      });
    }, 4000);

    return () => clearInterval(intervalId);
  }, [activeCustomerTicketId, loadMessages]);

  const [message, setMessage] = useState('');

  const sendMessage = async () => {
    const content = message.trim();

    if (!content || sending) return;

    setSending(true);
    setSendError('');

    try {
      if (!activeCustomerTicketId) {
        await addCustomerTicket({
          customer: 'Demo Customer',
          email: 'customer@example.com',
          subject: content.slice(0, 60),
          description: content,
        });
      } else {
        await addMessage(activeCustomerTicketId, 'customer', content);
      }

      setMessage('');
    } catch (error) {
      console.error('Message sending failed:', error);
      setSendError(error.message || 'Unable to send your message.');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className='min-h-dvh bg-slate-100 flex items-center justify-center p-4 sm:p-8'>
      <div className='w-full max-w-5xl h-[85dvh] min-h-[560px] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col'>
        {/* Header */}
        <header className='h-[76px] border-b border-slate-200 px-5 sm:px-8 flex items-center justify-between shrink-0'>
          <div className='flex items-center gap-3'>
            <div className='w-11 h-11 rounded-xl bg-blue-600 flex items-center justify-center'>
              <Headset className='text-white' size={23} />
            </div>

            <div>
              <h1 className='font-semibold text-slate-900'>Support Copilot</h1>
              <p className='text-xs text-slate-400'>
                {activeTicket
                  ? `Conversation with ${activeTicket.customer} · Ticket #${activeTicket.id}`
                  : 'Customer Support'}
              </p>
              <p className='text-xs text-emerald-600 flex items-center gap-1.5'>
                <span className='w-2 h-2 rounded-full bg-emerald-500' />
                Customer Support
              </p>
            </div>
          </div>

          <div className='flex items-center gap-2 text-slate-500 text-sm'>
            <ShieldCheck size={17} />
            <span className='hidden sm:block'>Secure Support</span>
          </div>
        </header>

        {/* Conversation */}
        <main className='flex-1 overflow-y-auto p-5 sm:p-8 bg-slate-50'>
          <div className='max-w-3xl mx-auto space-y-6'>
            <div className='text-center'>
              <span className='text-xs text-slate-400 bg-white border border-slate-200 rounded-full px-4 py-2'>
                Today · Support conversation
              </span>
            </div>

            {messages.length === 0 ? (
              <div className='flex justify-start'>
                <div className='max-w-[85%] rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm'>
                  Hello! Welcome to Support Copilot. How can we help you today?
                  <p className='mt-2 text-[11px] text-slate-400'>
                    Customer Care
                  </p>
                </div>
              </div>
            ) : (
              messages.map((item) => (
                <div
                  key={item.id}
                  className={`flex ${
                    item.sender === 'customer' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div className='max-w-[85%]'>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-6 ${
                        item.sender === 'customer'
                          ? 'bg-blue-600 text-white rounded-br-sm'
                          : 'bg-white text-slate-700 border border-slate-200 rounded-bl-sm shadow-sm whitespace-pre-line'
                      }`}
                    >
                      {item.content}
                    </div>

                    <p
                      className={`text-[11px] mt-2 text-slate-400 ${
                        item.sender === 'customer' ? 'text-right' : 'text-left'
                      }`}
                    >
                      {item.sender === 'customer' ? 'You' : 'Customer Care'} ·{' '}
                      {item.time}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </main>

        {/* Message Composer */}
        <footer className='border-t border-slate-200 p-4 sm:p-6 bg-white shrink-0'>
          <div className='max-w-3xl mx-auto'>
            <div className='flex items-end gap-3 border border-slate-200 rounded-2xl p-3 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-50 transition'>
              <button
                type='button'
                className='p-2 text-slate-400 hover:text-slate-700'
                aria-label='Attach file (coming soon)'
              >
                <Paperclip size={19} />
              </button>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder='Type your message...'
                rows={1}
                className='flex-1 resize-none outline-none text-sm text-slate-700 py-2 max-h-28'
              />

              <button
                type='button'
                onClick={sendMessage}
                disabled={!message.trim() || sending}
                className='w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed transition'
                aria-label='Send message'
              >
                <Send size={17} />
                {sendError && (
                  <p className='mt-2 text-center text-xs text-red-500'>
                    {sendError}
                  </p>
                )}
              </button>
            </div>

            <p className='text-center text-xs text-slate-400 mt-3'>
              Our support team will respond to your message here.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default CustomerChatTempPage;
