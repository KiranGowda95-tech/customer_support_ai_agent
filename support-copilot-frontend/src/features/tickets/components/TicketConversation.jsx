import { useState } from 'react';
import {
  ArrowLeft,
  UserRound,
  Bot,
  Sparkles,
  Send,
  Pencil,
  Clock3,
  CheckCircle2,
  MessageSquare,
} from 'lucide-react';

function TicketConversation({ ticket, onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'customer',
      content: ticket.subject + '. I need help resolving this issue.',
      time: ticket.createdAt || 'Today',
    },
  ]);

  const [draft, setDraft] = useState('');
  const [draftGenerated, setDraftGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);

  const generateDraft = () => {
    setGenerating(true);

    setTimeout(() => {
      setDraft(
        `Hello ${ticket.customer},\n\nThank you for contacting our support team. We understand your concern regarding "${ticket.subject}".\n\nWe're sorry for the inconvenience. Our team is reviewing your request and will help you resolve this issue. If you have any additional information, please share it with us.\n\nThank you for your patience.\nSupport Team`,
      );

      setDraftGenerated(true);
      setGenerating(false);
    }, 1000);
  };

  const sendReply = () => {
    if (!draft.trim()) return;

    const newMessage = {
      id: Date.now(),
      sender: 'agent',
      content: draft.trim(),
      time: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages((previous) => [...previous, newMessage]);
    setDraft('');
    setDraftGenerated(false);
  };

  return (
    <div className='mx-auto max-w-[1600px] space-y-5'>
      {/* Page header */}
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div>
          <button
            onClick={onBack}
            className='mb-3 flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-blue-600'
          >
            <ArrowLeft size={15} />
            Back to Tickets
          </button>

          <p className='text-xs text-slate-400'>
            Workspace / Tickets / {ticket.id}
          </p>

          <h1 className='mt-2 text-xl font-bold text-slate-900'>
            {ticket.subject}
          </h1>

          <p className='mt-1 text-xs text-slate-500'>
            Ticket {ticket.id} · Customer conversation
          </p>
        </div>

        <span className='rounded-lg bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-700'>
          {ticket.status}
        </span>
      </div>

      {/* Customer information */}
      <section className='rounded-xl border border-slate-200 bg-white p-5'>
        <div className='flex flex-wrap items-center justify-between gap-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
              <UserRound size={20} />
            </div>

            <div>
              <h2 className='text-sm font-semibold text-slate-900'>
                {ticket.customer}
              </h2>
              <p className='mt-1 text-xs text-slate-500'>{ticket.email}</p>
            </div>
          </div>

          <div className='flex gap-6'>
            <div>
              <p className='text-[10px] text-slate-400'>Priority</p>
              <p className='mt-1 text-xs font-semibold text-slate-700'>
                {ticket.priority}
              </p>
            </div>

            <div>
              <p className='text-[10px] text-slate-400'>Assigned to</p>
              <p className='mt-1 text-xs font-semibold text-slate-700'>
                {ticket.assignedTo}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main workspace */}
      <div className='grid grid-cols-1 gap-5 xl:grid-cols-[1fr_390px]'>
        {/* Conversation */}
        <section className='flex min-h-[620px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white'>
          <div className='flex items-center justify-between border-b border-slate-100 px-5 py-4'>
            <div>
              <h2 className='text-sm font-semibold text-slate-900'>
                Conversation
              </h2>
              <p className='mt-1 text-xs text-slate-400'>
                Customer and agent messages
              </p>
            </div>

            <MessageSquare size={18} className='text-slate-400' />
          </div>

          <div className='flex-1 space-y-6 overflow-y-auto bg-slate-50 p-5'>
            {messages.map((message) => {
              const isCustomer = message.sender === 'customer';

              return (
                <div
                  key={message.id}
                  className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                >
                  <div className='max-w-[85%]'>
                    <div
                      className={`mb-2 flex items-center gap-2 text-[11px] text-slate-400 ${
                        isCustomer ? '' : 'justify-end'
                      }`}
                    >
                      {isCustomer ? <UserRound size={13} /> : <Bot size={13} />}

                      {isCustomer ? ticket.customer : 'Customer Care'}
                    </div>

                    <div
                      className={`whitespace-pre-line rounded-xl px-4 py-3 text-sm leading-6 ${
                        isCustomer
                          ? 'rounded-tl-sm border border-slate-200 bg-white text-slate-700'
                          : 'rounded-tr-sm bg-blue-600 text-white'
                      }`}
                    >
                      {message.content}
                    </div>

                    <p
                      className={`mt-2 text-[10px] text-slate-400 ${
                        isCustomer ? '' : 'text-right'
                      }`}
                    >
                      {message.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* AI response workspace */}
        <section className='flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white'>
          <div className='border-b border-slate-100 p-5'>
            <div className='flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                <Sparkles size={18} />
              </div>

              <div>
                <h2 className='text-sm font-semibold text-slate-900'>
                  AI Response Assistant
                </h2>
                <p className='text-[11px] text-slate-400'>
                  Generate and review a response
                </p>
              </div>
            </div>
          </div>

          <div className='flex-1 space-y-4 p-5'>
            <div className='rounded-lg border border-violet-100 bg-violet-50/70 p-3'>
              <div className='flex items-center gap-2 text-xs font-semibold text-violet-700'>
                <Sparkles size={14} />
                AI-assisted response
              </div>

              <p className='mt-2 text-xs leading-5 text-violet-700/80'>
                Generate a contextual response using the customer's query and
                your support knowledge base.
              </p>
            </div>

            {!draftGenerated && !draft ? (
              <div className='flex min-h-[220px] flex-col items-center justify-center text-center'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400'>
                  <Bot size={23} />
                </div>

                <p className='text-sm font-medium text-slate-700'>
                  No response generated yet
                </p>

                <p className='mt-1 max-w-[230px] text-xs leading-5 text-slate-400'>
                  Generate an AI draft to get a suggested response.
                </p>
              </div>
            ) : (
              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label className='text-xs font-semibold text-slate-700'>
                    Response draft
                  </label>

                  <span className='flex items-center gap-1 text-[10px] text-emerald-600'>
                    <CheckCircle2 size={12} />
                    Generated
                  </span>
                </div>

                <textarea
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  rows={13}
                  className='w-full resize-y rounded-lg border border-slate-200 p-3 text-xs leading-6 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50'
                  placeholder='Your response draft...'
                />

                <p className='mt-2 flex items-center gap-1 text-[10px] text-slate-400'>
                  <Pencil size={11} />
                  You can edit this response before sending.
                </p>
              </div>
            )}
          </div>

          <div className='space-y-2 border-t border-slate-100 p-5'>
            <button
              onClick={generateDraft}
              disabled={generating}
              className='flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 text-xs font-semibold text-violet-700 transition hover:bg-violet-100 disabled:opacity-60'
            >
              <Sparkles size={15} />
              {generating ? 'Generating...' : 'Generate AI Draft'}
            </button>

            <button
              onClick={sendReply}
              disabled={!draft.trim()}
              className='flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40'
            >
              <Send size={15} />
              Send Reply
            </button>

            <p className='text-center text-[10px] text-slate-400'>
              <Clock3 size={11} className='mr-1 inline' />
              Agent review required before sending
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default TicketConversation;
