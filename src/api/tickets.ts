import { api } from './client';

export interface Ticket {
  id: number;
  ticketid: number;
  accountid: number;
  username: string;
  title: string;
  message: string;
  divs: string;
  tarih: string;
  first: number;
}

export interface TicketStatus {
  id: number;
  ticketid: number;
  accountid: number;
  username: string;
  title: string;
  message: string;
  status: number;
  tarih: string;
  type: number;
}

export const ticketsApi = {
  getTickets: () => api.get<TicketStatus[]>('/tickets'),
  getTicket: (ticketId: number) => api.get<Ticket[]>(`/tickets/${ticketId}`),
  createTicket: (title: string, message: string, divs: string) =>
    api.post('/tickets', { title, message, divs }),
  replyTicket: (ticketId: number, message: string) =>
    api.post(`/tickets/${ticketId}/reply`, { message }),
};
