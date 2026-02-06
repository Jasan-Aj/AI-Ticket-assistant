import React, { useState } from 'react';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('tickets');
  const [tickets, setTickets] = useState([
    { id: 1, title: 'Login Issue', status: 'Open', priority: 'High', createdAt: '2024-01-15', assignedTo: 'John Doe' },
    { id: 2, title: 'Payment Failed', status: 'In Progress', priority: 'Medium', createdAt: '2024-01-14', assignedTo: 'Jane Smith' },
    { id: 3, title: 'Feature Request', status: 'Closed', priority: 'Low', createdAt: '2024-01-13', assignedTo: 'Mike Johnson' },
    { id: 4, title: 'Bug Report', status: 'Open', priority: 'High', createdAt: '2024-01-12', assignedTo: 'Sarah Wilson' },
  ]);

  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', tickets: 12, joined: '2023-11-10' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Support', tickets: 8, joined: '2023-12-05' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', role: 'User', tickets: 5, joined: '2024-01-02' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', role: 'Support', tickets: 15, joined: '2023-10-20' },
  ]);

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

  const getRoleColor = (role) => {
    switch(role.toLowerCase()) {
      case 'admin': return 'bg-purple-100 text-purple-800';
      case 'support': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage tickets and user accounts</p>
      </div>

      {/* Tabs Navigation */}
      <div className="mb-8">
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab('tickets')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-colors ${activeTab === 'tickets' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Tickets
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded-full">
              {tickets.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-colors ${activeTab === 'users' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            Users
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded-full">
              {users.length}
            </span>
          </button>
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-lg shadow">
        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">All Tickets</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                + New Ticket
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <tr key={ticket.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">#{ticket.id}</td>
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
                      <td className="px-4 py-3 text-sm text-gray-900">{ticket.assignedTo}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{ticket.createdAt}</td>
                      <td className="px-4 py-3">
                        <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mr-3">Edit</button>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">All Users</h2>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                + Add User
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {users.map((user) => (
                <div key={user.id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 md:p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{user.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                    </div>
                    <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getRoleColor(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-2xl font-bold text-gray-800">{user.tickets}</div>
                      <div className="text-xs text-gray-500 mt-1">Tickets</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded border">
                      <div className="text-sm font-medium text-gray-800 mt-1">Joined</div>
                      <div className="text-sm text-gray-600 mt-1">{user.joined}</div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button className="flex-1 bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-3 py-2 rounded text-sm font-medium transition-colors">
                      View Profile
                    </button>
                    <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                      Message
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Stats Summary */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 mr-4">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Open Tickets</p>
              <p className="text-2xl font-bold text-gray-800">
                {tickets.filter(t => t.status === 'Open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 mr-4">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-5.197a9 9 0 00-9 9" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{users.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-yellow-100 mr-4">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-gray-800">
                {tickets.filter(t => t.status === 'In Progress').length}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;