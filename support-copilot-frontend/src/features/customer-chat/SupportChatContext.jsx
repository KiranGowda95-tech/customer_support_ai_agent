import { createContext, useCallback, useEffect, useState } from 'react';

import {
  createCustomerTicket,
  getTicketMessages,
  getTickets,
  sendCustomerMessage,
  sendAgentReply,
} from '../../services/supportChatApi';

export const SupportChatContext = createContext(null);

const formatStatus = (status = 'open') => {
  const labels = {
    open: 'Open',
    'in progress': 'In Progress',
    resolved: 'Resolved',
    closed: 'Resolved',
  };

  return labels[status.toLowerCase()] || status;
};

const formatPriority = (priority = 'medium') =>
  priority.charAt(0).toUpperCase() + priority.slice(1).toLowerCase();

const formatTime = (value) => {
  if (!value) return '';

  const date = new Date(value.replace(' ', 'T'));

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
};

const mapTicket = (ticket) => ({
  id: ticket.id,
  customer: ticket.customer_name || ticket.customer_email,
  email: ticket.customer_email,
  subject: ticket.subject,
  description: ticket.description,
  category: 'General',
  status: formatStatus(ticket.status),
  priority: formatPriority(ticket.priority),
  assignedTo: 'Unassigned',
  createdAt: ticket.created_at
    ? new Date(ticket.created_at.replace(' ', 'T')).toLocaleDateString()
    : '',
});

const mapMessage = (message) => ({
  id: message.id,
  sender: message.sender,
  content: message.content,
  time: formatTime(message.created_at),
});

export function SupportChatProvider({ children }) {
  const [tickets, setTickets] = useState([]);
  const [messagesByTicket, setMessagesByTicket] = useState({});
  const [activeCustomerTicketId, setActiveCustomerTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch only the ticket list.
  const refreshTickets = useCallback(async () => {
    try {
      const backendTickets = await getTickets();
      const mappedTickets = backendTickets.map(mapTicket);

      setTickets(mappedTickets);

      // Restore the customer's latest conversation if one exists.
      const customerTicket = mappedTickets.find(
        (ticket) => ticket.email === 'customer@example.com',
      );

      setActiveCustomerTicketId((currentId) => {
        return currentId ?? customerTicket?.id ?? null;
      });

      setError('');
    } catch (err) {
      console.error('Failed to load tickets:', err);
      setError(err.message || 'Unable to load tickets.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch messages for one specific ticket.
  const loadMessages = useCallback(async (ticketId) => {
    if (!ticketId) return;

    const messages = await getTicketMessages(ticketId);
    const mappedMessages = messages.map(mapMessage);

    setMessagesByTicket((previous) => ({
      ...previous,
      [ticketId]: mappedMessages,
    }));

    return mappedMessages;
  }, []);

  // Initial ticket load only. No global message polling.
  useEffect(() => {
    refreshTickets();
  }, [refreshTickets]);

  // Create a real customer ticket through FastAPI.
  const addCustomerTicket = async ({
    customer,
    email,
    subject,
    description,
  }) => {
    const response = await createCustomerTicket({
      customer,
      email,
      subject,
      description,
    });

    const newTicket = mapTicket(response);

    setTickets((previous) => [
      newTicket,
      ...previous.filter((ticket) => ticket.id !== newTicket.id),
    ]);

    setActiveCustomerTicketId(newTicket.id);

    // Load the initial customer message saved by the backend.
    await loadMessages(newTicket.id);

    return newTicket;
  };

  // Save a customer or agent message through FastAPI.
  const addMessage = async (ticketId, sender, content) => {
    const cleanContent = content.trim();

    if (!cleanContent || !ticketId) return;

    const ticket = tickets.find((item) => String(item.id) === String(ticketId));

    if (!ticket) {
      throw new Error('Ticket not found.');
    }

    if (sender === 'customer') {
      await sendCustomerMessage(ticketId, ticket.email, cleanContent);
    } else if (sender === 'agent') {
      await sendAgentReply(ticketId, cleanContent);
    } else {
      throw new Error('Invalid message sender.');
    }

    // Refresh only the conversation that received the message.
    await loadMessages(ticketId);
  };

  // Read cached messages. This function never calls the API.
  const getMessages = (ticketId) => messagesByTicket[ticketId] || [];

  return (
    <SupportChatContext.Provider
      value={{
        tickets,
        messagesByTicket,
        activeCustomerTicketId,
        setActiveCustomerTicketId,
        addCustomerTicket,
        addMessage,
        getMessages,
        loadMessages,
        refreshTickets,
        loading,
        error,
      }}
    >
      {children}
    </SupportChatContext.Provider>
  );
}
