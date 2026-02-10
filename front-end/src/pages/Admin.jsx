import React, { useState, useEffect, useCallback } from 'react';
import ModerateTicketsList from '../components/ModerateTicketsList';

const Admin = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [tickets, setTickets] = useState([]);
  const [users, setUsers] = useState([]);
  const [isActive, setActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('tickets');
  const [form, setForm] = useState({ role: "", skills: "" });
  const [error, setError] = useState({ state: false, message: "" });
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleError = (message) => {
    setError({ state: true, message });
    setTimeout(() => setError({ state: false, message: "" }), 3000);
  };

  // Wrapped in useCallback to prevent infinite loops in useEffect
  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket/moderate`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const ticketsData = await res.json();
        setTickets(ticketsData);
      }
    } catch (err) {
      handleError("Internal server error!");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/users`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const userData = await res.json();
        setUsers(userData);
      }
    } catch (err) {
      handleError("Failed to fetch users!");
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTickets();
      fetchUsers();
    }
  }, [fetchTickets, fetchUsers, token]);

  const handleDelete = async (ticket) => {
    if (!window.confirm("Delete this ticket?")) return;
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket/delete/${ticket._id}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) fetchTickets();
      else handleError("Failed to delete");
    } catch (err) {
      handleError("Error!");
    }
  };

  // Open modal and PRE-FILL data
  const openUpdateModal = (user) => {
    setSelectedUser(user);
    setForm({ 
      role: user.role, 
      skills: user.skills ? user.skills.join(", ") : "" 
    });
    setIsUpdateFormOpen(true);
  };

  const handleUserFormUpdate = async (e) => {
    e.preventDefault();
    const payload = {
      email: selectedUser.email,
      role: form.role,
      skills: typeof form.skills === 'string' 
        ? form.skills.split(",").map(s => s.trim()).filter(s => s !== "") 
        : form.skills
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/users/update`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setIsUpdateFormOpen(false);
        fetchUsers();
      } else {
        handleError("Failed to update user");
      }
    } catch (err) {
      handleError("Update failed!");
    }
  };

  const getStatusColor = (s = "") => {
    const status = s.toLowerCase();
    if (status === 'open') return 'bg-rose-50 text-rose-600 border-rose-100';
    if (status === 'in progress') return 'bg-amber-50 text-amber-600 border-amber-100';
    return 'bg-emerald-50 text-emerald-600 border-emerald-100';
  };

  return (
    <div className="min-h-screen bg-[#fafafa] p-4 md:p-8 font-sans text-slate-800">
      {/* Toast Notification */}
      {error.state && (
        <div className='fixed bottom-10 right-10 bg-white shadow-2xl border-l-4 border-rose-500 rounded-xl px-6 py-4 z-[110] animate-in fade-in slide-in-from-bottom-4 duration-300'>
          <p className='text-slate-800 font-bold text-sm'>{error.message}</p>
        </div>
      )}

      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Dashboard</h1>
          <p className="text-slate-500 font-medium text-sm">System Management</p>
        </div>
        
        <div className='relative'>
          <button 
            className='w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center font-bold text-white cursor-pointer shadow-lg shadow-indigo-200 hover:scale-105 transition-transform'
            onClick={() => setActive(!isActive)}
          >
            {user.name ? user.name[0].toUpperCase() : 'A'}
          </button>
          {isActive && (
            <div className='absolute top-14 right-0 bg-white shadow-2xl rounded-2xl py-2 min-w-[160px] z-50 border border-slate-100'>
              <button className='w-full text-left px-4 py-3 text-rose-500 font-bold text-sm hover:bg-rose-50 transition-colors' onClick={() => { localStorage.clear(); window.location.reload(); }}>
                Sign Out
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        <div className="flex gap-2 mb-8 bg-slate-200/50 p-1.5 rounded-2xl w-fit">
          {['tickets', 'users', 'moderation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
                activeTab === tab 
                  ? 'bg-white text-indigo-600 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden min-h-[400px]">
          {loading ? (
            <div className="flex items-center justify-center h-[400px] text-slate-400 font-bold">Loading...</div>
          ) : (
            <>
              {activeTab === 'tickets' && (
                <div className="p-4 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left">
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Title</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                        <th className="px-6 py-5 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {tickets.map((ticket) => (
                        <tr key={ticket._id} className="group hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-5 font-bold text-slate-700">{ticket.title}</td>
                          <td className="px-6 py-5">
                            <span className={`px-3 py-1 rounded-lg text-[10px] font-black border uppercase ${getStatusColor(ticket.status)}`}>
                              {ticket.status}
                            </span>
                          </td>
                          <td className="px-6 py-5 text-right">
                            <button onClick={() => handleDelete(ticket)} className="text-rose-400 hover:text-rose-600 font-black text-[10px] uppercase tracking-widest">
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'users' && (
                <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {users.map((u) => (
                    <div key={u._id} className="p-6 rounded-[2rem] border border-slate-100 bg-[#fdfdfd] hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <h3 className="font-black text-slate-900 leading-tight">{u.name}</h3>
                          <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-tighter">{u.email}</p>
                        </div>
                        <span className="bg-slate-100 text-slate-600 text-[9px] font-black px-2 py-1 rounded-md uppercase">
                          {u.role}
                        </span>
                      </div>
                      <button 
                        onClick={() => openUpdateModal(u)}
                        className="w-full py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-indigo-600 hover:text-indigo-600 transition-all active:scale-95"
                      >
                        Settings
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'moderation' && (
                <div className="p-6">
                  <ModerateTicketsList tickets={tickets} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal - Better Z-Index and Alignment */}
      {isUpdateFormOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsUpdateFormOpen(false)} />
          <div className="relative bg-white rounded-[2.5rem] shadow-2xl w-full max-w-md p-10 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-900">User Setup</h2>
              <button onClick={() => setIsUpdateFormOpen(false)} className="text-slate-300 hover:text-rose-500 font-bold text-2xl transition-colors">&times;</button>
            </div>
            
            <form onSubmit={handleUserFormUpdate} className="space-y-6">
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Access Level</label>
                <select 
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-[10px] font-black uppercase text-slate-400 mb-2 tracking-widest">Specialties (Comma separated)</label>
                <input 
                  type="text"
                  className="w-full p-4 bg-slate-50 border-2 border-transparent rounded-2xl font-bold text-sm focus:border-indigo-500 focus:bg-white outline-none transition-all"
                  placeholder="e.g. Frontend, API, Security"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>

              <button type="submit" className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-indigo-100 hover:bg-indigo-700 active:scale-[0.98] transition-all">
                Update Profile
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;