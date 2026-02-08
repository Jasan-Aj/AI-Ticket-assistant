import { useState } from 'react';
import TicketDetails from '../pages/TicketDetailsPage';

function ModerateTicketsList({tickets}) {
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState({state: false, message: ""});

  const handleError = (message)=>{
    setError({state:true, message});
    setTimeout(() => {
      setError({state:false, message:""})
    }, 3000);
  }
  
  const handleTicketClick = (ticket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedTicket(null);
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'open': return 'bg-red-100 text-red-800';
      case 'in progress': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority.toLowerCase()) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  

  return (
    <div>
    <div className="p-4 md:p-6">

          {
            error.state && (
            <div className='absolute bottom-6 right-6 bg-white shadow-lg border-l-4 border-red-500 rounded-lg px-4 py-4 z-10'>
                <p className='text-red-900 font-semibold'>
                {error.message}
                </p>
            </div>
            )
          }

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">My Tickets</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr 
                      key={ticket.id} 
                      className="hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleTicketClick(ticket)}
                    >
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{ticket.title}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(ticket.status)}`}>
                          {ticket.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <span className={`w-3 h-3 rounded-full mr-2 ${getPriorityColor(ticket.priority)}`}></span>
                          <span className="text-sm text-gray-900">{ticket.priority}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500">{ticket.createdAt}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {isModalOpen && selectedTicket && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={closeModal}
            ></div>
            
            {/* Modal Container */}
            <div className="flex min-h-full items-center justify-center p-4">
              <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                {/* Modal Header */}
                <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Ticket Details
                  </h2>
                  <button
                    onClick={closeModal}
                    className="text-gray-400 hover:text-gray-500 text-2xl font-semibold"
                  >
                    ×
                  </button>
                </div>
                
                <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                  <TicketDetails 
                    ticket={selectedTicket}
                    onClose={closeModal}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
        </div>

          
  )
}

export default ModerateTicketsList