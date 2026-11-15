const API_BASE_URL = 'http://127.0.0.1:8000/api';

async function apiRequest(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API Error (${response.status}): ${errorText}`);
  }

  return response.json();
}

// Create a new customer ticket.
export function createCustomerTicket(ticketData) {
  return apiRequest('/tickets', {
    method: 'POST',
    body: JSON.stringify({
      customer_email: ticketData.email,
      customer_name: ticketData.customer,
      subject: ticketData.subject,
      description: ticketData.description,
      priority: 'medium',
      auto_generate: true,
    }),
  });
}

// Retrieve conversation history.
export function getTicketMessages(ticketId) {
  return apiRequest(`/tickets/${ticketId}/messages`);
}

// Send a customer message to an existing ticket.
export function sendCustomerMessage(ticketId, email, content) {
  return apiRequest(`/tickets/${ticketId}/messages/customer`, {
    method: 'POST',
    body: JSON.stringify({
      customer_email: email,
      content,
    }),
  });
}

// Send an agent reply.
export function sendAgentReply(ticketId, content) {
  return apiRequest(`/tickets/${ticketId}/messages/reply`, {
    method: 'POST',
    body: JSON.stringify({ content }),
  });
}

// Retrieve all tickets from the backend.
export function getTickets() {
  return apiRequest('/tickets');
}

export function generateTicketDraft(ticketId) {
  return apiRequest(`/tickets/${ticketId}/generate-draft`, {
    method: 'POST',
  });
}

export function updateTicketDraft(draftId, content, status = 'pending') {
  return apiRequest(`/drafts/${draftId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      content,
      status,
    }),
  });
}
