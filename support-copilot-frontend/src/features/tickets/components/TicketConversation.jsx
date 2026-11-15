import { useState } from 'react';
import { useSupportChat } from '../../customer-chat/useSupportChat';
import {
  generateTicketDraft,
  updateTicketDraft,
} from '../../../services/supportChatApi';
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
  const { getMessages, addMessage } = useSupportChat();

  const messages = getMessages(ticket.id);

  const [draft, setDraft] = useState('');
  const [draftId, setDraftId] = useState(null);
  const [savingDraft, setSavingDraft] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState('');
  const [saveError, setSaveError] = useState('');
  const [replySent, setReplySent] = useState(false);
  const [acceptError, setAcceptError] = useState('');

  const [draftGenerated, setDraftGenerated] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [draftContext, setDraftContext] = useState(null);
  const [draftError, setDraftError] = useState('');

  const generateDraft = async () => {
    setGenerating(true);
    setDraftError('');
    setSaveError('');
    setSaveSuccess('');

    try {
      const response = await generateTicketDraft(ticket.id);

      setDraft(response.draft.content);
      setDraftId(response.draft.id);
      setDraftContext(response.draft.context_used);
      setDraftGenerated(true);
    } catch (error) {
      console.error('AI draft generation failed:', error);
      setDraftError(error.message || 'Unable to generate AI draft.');
    } finally {
      setGenerating(false);
    }
  };

  const saveDraft = async () => {
    const content = draft.trim();

    if (!content || !draftId || savingDraft || replySent) return;

    setSavingDraft(true);
    setSaveSuccess('');
    setSaveError('');

    try {
      const response = await updateTicketDraft(draftId, content);

      setDraft(response.content);
      setSaveSuccess('Draft saved successfully.');
    } catch (error) {
      console.log(error);
      setSaveError(error.message || 'Unable to save draft.');
    } finally {
      setSavingDraft(false);
    }
  };

  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState('');

  const sendReply = async () => {
    const content = draft.trim();

    if (!content || !draftId || sending || replySent) return;

    setSending(true);
    setSendError('');
    setSaveError('');
    setSaveSuccess('');
    setAcceptError('');

    try {
      const savedDraft = await updateTicketDraft(draftId, content, 'pending');

      setDraft(savedDraft.content);

      await addMessage(ticket.id, 'agent', savedDraft.content);

      setReplySent(true);

      try {
        const acceptedDraft = await updateTicketDraft(
          draftId,
          savedDraft.content,
          'accepted',
        );

        setDraft(acceptedDraft.content);
        setSaveSuccess('Reply sent and draft accepted successfully.');
      } catch (error) {
        console.error('Draft acceptence failed: ', error);
        setSendError(error.message || 'Unable to send reply.');
      } finally {
        setSending(false);
      }

      setDraftGenerated(false);
    } catch (error) {
      console.error('Agent reply failed:', error);
      setSendError(error.message || 'Unable to send reply.');
    } finally {
      setSending(false);
    }
  };

  const retryAcceptDraft = async () => {
    if (!replySent || !draftId || sending) return;

    setSending(true);
    setAcceptError('');

    try {
      const response = await updateTicketDraft(draftId, draft, 'accepted');

      setDraft(response.content);
      setAcceptError('');
      setSaveSuccess('Draft accepted successfully.');
    } catch (error) {
      console.error('Draft acceptance retry failed:', error);

      setAcceptError(error.message || 'Unable to accept the draft.');
    } finally {
      setSending(false);
    }
  };

  return (
    <section className='flex h-full min-h-[650px] min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-white'>
      {/* Selected customer header */}
      <header className='flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4'>
        <div className='flex min-w-0 items-center gap-3'>
          <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600'>
            <UserRound size={19} />
          </div>

          <div className='min-w-0'>
            <h2 className='truncate text-sm font-semibold text-slate-900'>
              {ticket.customer}
            </h2>
            <p className='truncate text-xs text-slate-400'>
              {ticket.email} · {ticket.id}
            </p>
          </div>
        </div>

        <span className='rounded-md bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-700'>
          {ticket.status}
        </span>
      </header>

      {/* Conversation and AI workspace */}
      <div className='grid min-h-0 flex-1 grid-cols-1 xl:grid-cols-[minmax(0,1fr)_340px]'>
        {/* Messages */}
        <div className='flex min-h-[400px] min-w-0 flex-col border-b border-slate-100 xl:border-b-0 xl:border-r'>
          <div className='border-b border-slate-100 px-5 py-3'>
            <h3 className='text-xs font-semibold text-slate-800'>
              Conversation history
            </h3>
            <p className='mt-1 text-[10px] text-slate-400'>
              Messages exchanged with this customer
            </p>
          </div>

          <div className='min-h-0 flex-1 space-y-5 overflow-y-auto bg-slate-50 p-5'>
            {messages.map((item) => {
              const isCustomer = item.sender === 'customer';

              return (
                <div
                  key={item.id}
                  className={`flex ${isCustomer ? 'justify-start' : 'justify-end'}`}
                >
                  <div className='max-w-[90%] min-w-0'>
                    <p
                      className={`mb-2 text-[10px] text-slate-400 ${
                        isCustomer ? '' : 'text-right'
                      }`}
                    >
                      {isCustomer ? ticket.customer : 'Customer Care'}
                    </p>

                    <div
                      className={`whitespace-pre-line break-words rounded-xl px-4 py-3 text-xs leading-6 ${
                        isCustomer
                          ? 'rounded-tl-sm border border-slate-200 bg-white text-slate-700'
                          : 'rounded-tr-sm bg-blue-600 text-white'
                      }`}
                    >
                      {item.content}
                    </div>

                    <p
                      className={`mt-1 text-[10px] text-slate-400 ${
                        isCustomer ? '' : 'text-right'
                      }`}
                    >
                      {item.time}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI assistant */}
        <aside className='flex min-h-[450px] min-w-0 flex-col bg-white'>
          <div className='border-b border-slate-100 p-4'>
            <div className='flex items-center gap-2'>
              <div className='flex h-9 w-9 items-center justify-center rounded-lg bg-violet-50 text-violet-600'>
                <Sparkles size={17} />
              </div>

              <div>
                <h3 className='text-xs font-semibold text-slate-900'>
                  AI Response Assistant
                </h3>
                <p className='text-[10px] text-slate-400'>
                  Generate and review a response
                </p>
              </div>
            </div>
          </div>

          <div className='flex-1 space-y-4 overflow-y-auto p-4'>
            <div className='rounded-lg border border-violet-100 bg-violet-50/70 p-3'>
              <p className='flex items-center gap-2 text-xs font-semibold text-violet-700'>
                <Sparkles size={13} />
                AI-assisted response
              </p>
              {draftError && (
                <div className='rounded-lg border border-red-200 bg-red-50 p-3 text-xs text-red-600'>
                  {draftError}
                </div>
              )}
              <p className='mt-2 text-[11px] leading-5 text-violet-700/80'>
                Generate a contextual response using the customer's query and
                your support knowledge base.
              </p>
            </div>

            {!draftGenerated && !draft ? (
              <div className='flex min-h-[180px] flex-col items-center justify-center text-center'>
                <Bot size={25} className='text-slate-300' />
                <p className='mt-3 text-xs font-medium text-slate-700'>
                  No response generated yet
                </p>
                <p className='mt-1 max-w-[220px] text-[10px] leading-5 text-slate-400'>
                  Generate an AI draft to get a suggested response.
                </p>
              </div>
            ) : (
              <div>
                <div className='mb-2 flex items-center justify-between'>
                  <label className='text-xs font-semibold text-slate-700'>
                    Response draft
                  </label>
                  <span className='text-[10px] text-emerald-600'>
                    Generated
                  </span>
                </div>

                <textarea
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  rows={12}
                  className='w-full resize-y rounded-lg border border-slate-200 p-3 text-xs leading-6 text-slate-700 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50'
                  placeholder='Your response draft...'
                />

                <p className='mt-2 text-[10px] text-slate-400'>
                  Edit this response before sending.
                </p>
              </div>
            )}
          </div>

          <div className='space-y-2 border-t border-slate-100 p-4'>
            <button
              onClick={generateDraft}
              disabled={generating || replySent}
              className='flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-violet-200 bg-violet-50 text-xs font-semibold text-violet-700 hover:bg-violet-100 disabled:opacity-60'
            >
              <Sparkles size={14} />
              {generating ? 'Generating...' : 'Generate AI Draft'}
            </button>

            <button
              onClick={saveDraft}
              disabled={!draft.trim() || !draftId || savingDraft || replySent}
              className='flex h-10 w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40'
            >
              {savingDraft ? 'Saving...' : 'Save Draft'}
            </button>

            {saveSuccess && (
              <p className='text-center text-xs text-emerald-600'>
                {saveSuccess}
              </p>
            )}

            {saveError && (
              <p className='text-center text-xs text-red-500'>{saveError}</p>
            )}

            {sendError && (
              <p className='text-center text-xs text-red-500'>{sendError}</p>
            )}

            {acceptError && (
              <div className='space-y-2 rounded-lg border border-amber-200 bg-amber-50 p-3'>
                <p className='text-xs text-amber-700'>{acceptError}</p>

                <button
                  onClick={retryAcceptDraft}
                  disabled={sending}
                  className='w-full rounded-lg bg-amber-600 px-3 py-2 text-xs font-semibold text-white hover:bg-amber-700 disabled:opacity-50'
                >
                  Retry Draft Acceptance
                </button>
              </div>
            )}

            <button
              onClick={sendReply}
              disabled={!draft.trim() || !draftId || sending || replySent}
              className='flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-blue-600 text-xs font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40'
            >
              <Send size={14} />
              {sending
                ? 'Processing...'
                : replySent
                  ? 'Reply Sent'
                  : 'Send Reply'}
            </button>

            <p className='text-center text-[10px] text-slate-400'>
              {replySent
                ? 'Reply has been delivered to the customer.'
                : 'Your latest edits will be saved before sending.'}
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}

export default TicketConversation;
