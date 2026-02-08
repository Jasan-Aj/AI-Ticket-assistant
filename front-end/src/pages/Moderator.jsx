import React from 'react'
import ModerateTicketsList from '../components/ModerateTicketsList';
import { useState } from 'react';

function Moderator() {

    const [tickets, setTickets] = useState([
        { id: "1", title: 'Login Issue', status: 'Open', priority: 'High', createdAt: '2024-01-15', assignedTo: 'John Doe' },
        { id: "2", title: 'Payment Failed', status: 'In Progress', priority: 'Medium', createdAt: '2024-01-14', assignedTo: 'Jane Smith' },
        { id: "3", title: 'Feature Request', status: 'Closed', priority: 'Low', createdAt: '2024-01-13', assignedTo: 'Mike Johnson' },
        { id: "4", title: 'Bug Report', status: 'Open', priority: 'High', createdAt: '2024-01-12', assignedTo: 'Sarah Wilson' },
    ]);

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4 md:p-6 overflow-hidden">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Moderator Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage tickets</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-y-auto">
        <ModerateTicketsList tickets={tickets} />
      </div>
    </div>
  )
}

export default Moderator