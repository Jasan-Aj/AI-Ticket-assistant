import { useState } from 'react';
import TicketDetails from '../pages/TicketDetailsPage';

function ModerateTicketsList({ tickets, fetchTickets }) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const getStatusColor = (status = "") => {
    switch (status.toLowerCase()) {
      case 'open': return 'bg-rose-400';
      case 'in progress': return 'bg-amber-400';
      case 'closed': return 'bg-emerald-400';
      default: return 'bg-slate-200';
    }
  };

  const getPriorityColor = (priority = "") => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-rose-500';
      case 'medium': return 'bg-amber-400';
      case 'low': return 'bg-emerald-400';
      default: return 'bg-slate-500';
    }
  };

  return (
    <div className="bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-4 border-black">
              <th className="px-6 py-5 text-left text-xs font-black uppercase italic tracking-widest bg-blue-100 border-r-4 border-black">Title</th>
              <th className="px-6 py-5 text-left text-xs font-black uppercase italic tracking-widest bg-pink-100 border-r-4 border-black">Status</th>
              <th className="px-6 py-5 text-left text-xs font-black uppercase italic tracking-widest bg-yellow-100 border-r-4 border-black">Priority</th>
              <th className="px-6 py-5 text-left text-xs font-black uppercase italic tracking-widest bg-emerald-100">Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {tickets.map((ticket) => (
              <tr
                key={ticket._id || ticket.id}
                className="border-b-4 border-black hover:bg-slate-50 cursor-pointer transition-colors group"
                onClick={() => handleTicketClick(ticket)}
              >
                <td className="px-6 py-5 border-r-4 border-black font-black text-lg uppercase italic group-hover:text-indigo-600">
                  {ticket.title}
                </td>
                <td className="px-6 py-5 border-r-4 border-black">
                  <span className={`px-3 py-1 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getStatusColor(ticket.status)}`}>
                    {ticket.status}
                  </span>
                </td>
                <td className="px-6 py-5 border-r-4 border-black">
                  <div className="flex items-center gap-2">
                    <div className={`w-4 h-4 border-2 border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] ${getPriorityColor(ticket.priority)}`}></div>
                    <span className="text-xs font-black uppercase">{ticket.priority}</span>
                  </div>
                </td>
                <td className="px-6 py-5 text-xs font-bold font-mono text-slate-500">
                  {new Date(ticket.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Neo-Brutalist Modal */}
      {isModalOpen && selectedTicket && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 md:p-8">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-[2px]"
            onClick={closeModal}
          ></div>

          {/* Modal Content */}
          <div className="relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between bg-indigo-500 border-b-4 border-black p-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-white/80 uppercase tracking-widest">Case File</span>
                <h2 className="text-2xl font-black text-white uppercase italic leading-none">
                  Ticket Details
                </h2>
              </div>
              <button
                onClick={closeModal}
                className="bg-black text-white w-12 h-12 border-2 border-white font-black text-2xl flex items-center justify-center hover:bg-rose-500 transition-colors"
              >
                ×
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto p-2 bg-[#FDFCF0]">
              <div className="bg-white ">
                <TicketDetails
                  ticket={selectedTicket}
                  closeModal={closeModal}
                  fetchTickets={fetchTickets}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ModerateTicketsList;