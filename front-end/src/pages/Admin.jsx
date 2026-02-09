import React, { useState } from 'react';
import TicketDetails from './TicketDetailsPage';
import ModerateTicketsList from '../components/ModerateTicketsList';

const Admin = () => {

    const token = localStorage.getItem("token");

    const [tickets, setTickets] = useState([]);
    const [users, setUsers] = useState([]);

    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('tickets');

    const [form, setForm] = useState({role: "", skills: ""});
    const [error, setError] = useState({state: false, message: ""});

    const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
  
    const fetchTickets = async ()=>{
        setLoading(true);
        try{
          const res = await fetch(`${import.meta.env.VITE_URL}/api/ticket/moderate`,{
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
    
          if(res.ok){
            const ticketsData = await res.json(); 
            setTickets(ticketsData);
            return ticketsData;
          }else{
            handleError("Failed to fetch tickets!");
            return null;
          }
        }catch(error){
          handleError("Failed to fetch tickets!");
        } finally {
          setLoading(false);
        }
    }

    const fetchUsers = async ()=>{
        setLoading(true);
        try{
          const res = await fetch(`${import.meta.env.VITE_URL}/api/users`,{
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`
            }
          });
    
          if(res.ok){
            const userData = await res.json(); 
            setUsers(userData);
            return userData;
          }else{
            handleError("Failed to fetch users!");
            return null;
          }
        }catch(error){
          handleError("Failed to fetch users!");
        } finally {
          setLoading(false);
        }
    }
    
      useEffect(() => {
        fetchTickets();
        fetchUsers();
      }, []);

  const handleDelete = async(ticket)=>{
    try{
      const res = await fetch(`${import.meta.env.VITE_URL}/api/ticket/delete/${ticket._id}`,{
        method : "DELETE",
        body: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(res.ok){
        fetchTickets();
      }else{
        handleError("Failed to delete ticket")
      }

    }catch(error){
      handleError("Internal server error!");
    }
  }

  const handleError = (message)=>{
    setError({state:true, message});
    setTimeout(() => {
      setError({state:false, message:""})
    }, 3000);
  }

  const handleUpdateUser = (user) => {
    setSelectedUser(user);
    setIsUpdateFormOpen(true);
  };

  const closeUpdateForm = () => {
    setIsUpdateFormOpen(false);
    setSelectedUser(null);
  };

  const handleChange = (event)=>{
    setForm({...form, [event.target.name]: event.target.value});
  }

  const handleUserFormUpdate = async (event)=>{

    event.preventDefault();
    let skills;
    let role;

    console.log(selectedUser);
    
    try{

      if(form.role.trim() == "" && form.skills.trim() == ""){
        handleError("There no data for update!")
      }
      
      if(form.skills.trim() !== ""){
        skills = form.skills.split(" ").map((skill)=> skill.trim());
      }

      if(form.role.trim() !== ""){
        role = form.role;
      }

      const res = await fetch(`${import.meta.env.VITE_URL}/users/update`,{
        method: "POST",
        headers: {
          "Authorization" : `Bearer ${token}`,
          "Content-Type" : "application/json"
        },
        body: JSON.stringify({
          email: selectedUser.email,
          skills,
          role
        })
      });

      if(res.ok){
        closeUpdateForm();
        fetchUsers();
      }else{
        handleError("Failed to update user!");
      }

    }catch(error){
      handleError("Failed to update user!");
    }
  }

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
      case 'moderator': return 'bg-blue-100 text-blue-800';
      case 'user': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4 md:p-6 overflow-hidden">


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
          <button
            onClick={() => setActiveTab('myTickets')}
            className={`flex-1 md:flex-none px-4 md:px-6 py-3 text-sm md:text-base font-medium transition-colors ${activeTab === 'myTickets' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
          >
            My Tickets
            <span className="ml-2 bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded-full">
              {users.length}
            </span>
          </button>
        </div>
      </div>
      
      {/* Content Area */}
      <div className="bg-white rounded-lg shadow overflow-y-auto">
        {/* Tickets Tab */}
        {activeTab === 'tickets' && (
          <div className="p-4 md:p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">All Tickets</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-gray-50">
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
                    <tr 
                      key={ticket.id} 
                      className="hover:bg-gray-50"
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
                      <td className="px-4 py-3 text-sm text-gray-500">{ticket.assignedTo}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{ticket.createdAt}</td>
                      <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                        <button className="text-red-600 hover:text-red-800 text-sm font-medium cursor-pointer" onClick={()=> handleDelete(ticket)}>
                          Delete
                        </button>
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
                    <button 
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                      onClick={() => handleUpdateUser(user)}
                    >
                      Update
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* My Tickets Tab */}
        {activeTab === 'myTickets' && (
          <div>
            <ModerateTicketsList tickets={tickets}/>
          </div>
        )}
      </div>

      {/* Update User Modal Overlay */}
      {isUpdateFormOpen && selectedUser && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
            onClick={closeUpdateForm}
          ></div>
          
          {/* Modal Container */}
          <div className="flex min-h-full items-center justify-center p-4">
            <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md">
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  Update User
                </h2>
                <button
                  onClick={closeUpdateForm}
                  className="text-gray-400 hover:text-gray-500 text-2xl font-semibold"
                >
                  ×
                </button>
              </div>
              
              {/* Modal Body */}
              <div className="p-6">
                <form onSubmit={handleUserFormUpdate}>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
                    <div className="px-4 py-3 bg-gray-50 rounded-lg border border-gray-300">
                      <div className="font-medium text-gray-900">{selectedUser.name}</div>
                      <div className="text-sm text-gray-600 mt-1">{selectedUser.email}</div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                    <select 
                      name='role'
                      onChange={()=> handleChange(event)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                      defaultValue={selectedUser.role}
                    >
                      <option value="User">User</option>
                      <option value="Moderator">Moderator</option>
                      <option value="Admin">Admin</option>
                    </select>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <input
                      name='skills'
                      onChange={()=> handleChange(event)} 
                      type="text" 
                      placeholder="Enter skills (e.g., Technical Support, Customer Service)"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-700"
                    />
                  </div>

                  {error.state && <div className='pb-3 text-sm text-red-600 pl-1'>
                    {error.message}
                  </div>}

                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={closeUpdateForm}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;