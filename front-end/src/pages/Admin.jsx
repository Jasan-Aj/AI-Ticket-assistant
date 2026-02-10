import React, { useState, useEffect, useCallback } from 'react';
import ModerateTicketsList from '../components/ModerateTicketsList';
import { useNavigate } from 'react-router-dom';

const Admin = () => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [moderationtickets, setModerationTickets] = useState([]);
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

  const fetchTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const ticketsData = await res.json();
        setTickets(Array.isArray(ticketsData) ? ticketsData : []);
      }
    } catch (err) {
      handleError("Internal server error!");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const fetchModerationTickets = useCallback(async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket/moderate`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const ticketsData = await res.json();
        setModerationTickets(Array.isArray(ticketsData) ? ticketsData : []);
      }
    } catch (err) {
      handleError("Internal server error!");
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
        setUsers(Array.isArray(userData) ? userData : []);
      } else {
        setUsers([]);
      }
    } catch (err) {
      handleError("Failed to fetch users!");
      setUsers([]);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchTickets();
      fetchUsers();
      fetchModerationTickets();
    }
  }, [fetchTickets, fetchUsers, fetchModerationTickets, token]);

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

  const handleLogout = async ()=>{
    try{
      const res = await fetch(`${import.meta.env.VITE_URL}/auth/sign-out`,{
        method: "DELETE",
        headers: {
          "Authorization" : `Bearer ${token}`
        }
      });

      if(res.ok){
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
      }else{
        handleError("Failed logout user!");
      }

    }catch(error){
      handleError("Internal server error!")
    }
  }

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
    if (status === 'open') return 'bg-rose-400';
    if (status === 'in progress') return 'bg-amber-400';
    return 'bg-emerald-400';
  };

  return (
    <div className="min-h-screen bg-[#FDFCF0] p-4 md:p-8 font-sans text-black">
      {/* Error Toast */}
      {error.state && (
        <div className='fixed bottom-10 right-10 bg-rose-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-4 z-[110] animate-bounce'>
          <p className='font-black text-sm uppercase italic'>{error.message}</p>
        </div>
      )}

      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <h1 className="text-4xl font-black uppercase italic leading-none">Admin Panel</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 text-indigo-600">Secure Access Restricted</p>
        </div>
        
        <div className='flex items-center gap-4'>
          {/* Username Label - Added Styling Here */}
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1 text-slate-500">Authorized Personnel</p>
            <p className="text-sm font-black uppercase italic border-b-2 border-black inline-block">{user.name || 'Anonymous'}</p>
          </div>

          <div className='relative'>
            <button 
              className='w-14 h-14 border-4 border-black bg-yellow-400 flex items-center justify-center font-black text-2xl cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all'
              onClick={() => setActive(!isActive)}
            >
              {user.name ? user.name[0].toUpperCase() : 'A'}
            </button>

            {isActive && (
              <div className='absolute top-16 right-0 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-2 min-w-[160px] z-50'>
                {/* Mobile view username inside dropdown */}
                <div className="md:hidden px-4 py-2 border-b-2 border-black bg-slate-50">
                  <p className="text-[8px] font-black uppercase text-slate-400">User</p>
                  <p className="text-xs font-black uppercase">{user.name}</p>
                </div>
                <button className='w-full text-left px-4 py-3 text-black font-black text-xs uppercase hover:bg-rose-400 transition-colors cursor-pointer' onClick={() => handleLogout()}>
                  Sign Out →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-10">
          {['tickets', 'users', 'moderation'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-8 py-3 border-4 border-black font-black uppercase italic tracking-wider transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 ${
                activeTab === tab 
                  ? 'bg-indigo-500 text-white translate-x-1 translate-y-1 shadow-none' 
                  : 'bg-white hover:bg-yellow-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-h-[500px]">
          {loading ? (
            <div className="flex items-center justify-center h-[400px]">
               <div className="font-black text-3xl uppercase italic animate-pulse">Loading...</div>
            </div>
          ) : (
            <div className="p-6">
              {activeTab === 'tickets' && (
                <div className="overflow-x-auto">
                  {tickets.length > 0 ? (
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b-4 border-black">
                          <th className="px-6 py-5 text-left text-xs font-black uppercase italic tracking-widest bg-blue-100 border-r-4 border-black">Title</th>
                          <th className="px-6 py-5 text-left text-xs font-black uppercase italic tracking-widest bg-pink-100 border-r-4 border-black">Status</th>
                          <th className="px-6 py-5 text-right text-xs font-black uppercase italic tracking-widest bg-yellow-100">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map((ticket) => (
                          <tr key={ticket._id} className="border-b-4 border-black hover:bg-slate-50 transition-colors">
                            <td className="px-6 py-5 font-black text-lg border-r-4 border-black">{ticket.title}</td>
                            <td className="px-6 py-5 border-r-4 border-black">
                              <span className={`px-4 py-1 border-2 border-black font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getStatusColor(ticket.status)}`}>
                                {ticket.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right">
                              <button onClick={() => handleDelete(ticket)} className="bg-white border-2 border-black px-4 py-1 font-black text-[10px] uppercase hover:bg-rose-500 hover:text-white transition-all">
                                Delete [X]
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[350px] border-4 border-dashed border-black m-4">
                      <p className="font-black uppercase italic text-2xl">Null Set</p>
                      <p className="text-[12px] font-bold mt-2">No tickets currently exist in the database.</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'users' && (
                <div>
                  {users.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {users.map((u) => (
                        <div key={u._id} className="p-6 border-4 border-black bg-[#fafafa] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-1 transition-all">
                          <div className="mb-6">
                             <div className="bg-black text-white px-2 py-0.5 w-fit text-[9px] font-black uppercase mb-2">ID: {u._id.slice(-5)}</div>
                             <h3 className="text-2xl font-black uppercase italic leading-tight truncate">{u.name}</h3>
                             <p className="text-xs font-bold text-slate-500 truncate">{u.email}</p>
                          </div>
                          <div className="flex items-center gap-2 mb-6">
                             <span className="bg-indigo-400 border-2 border-black text-[10px] font-black px-2 py-1 uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                               {u.role}
                             </span>
                          </div>
                          <button 
                            onClick={() => openUpdateModal(u)}
                            className="w-full py-3 bg-yellow-300 border-4 border-black font-black uppercase italic text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all"
                          >
                            Modify Permissions
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20 border-4 border-black border-dashed">
                      <p className="font-black uppercase text-xl">User Registry Empty</p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'moderation' && (
                <div className="bg-pink-50 border-4 border-black p-4">
                  {moderationtickets.length > 0 ? (
                    <ModerateTicketsList tickets={moderationtickets} />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-[300px]">
                      <p className="font-black uppercase text-4xl italic">Queue Clear</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isUpdateFormOpen && selectedUser && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-[2px]" onClick={() => setIsUpdateFormOpen(false)} />
          <div className="relative bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-md p-10">
            <div className="flex justify-between items-center mb-10 bg-indigo-500 border-b-4 border-black -m-10 p-10 mb-10">
              <h2 className="text-3xl font-black text-white uppercase italic">Modify User</h2>
              <button onClick={() => setIsUpdateFormOpen(false)} className="bg-black text-white w-10 h-10 font-black text-xl border-2 border-white">×</button>
            </div>
            
            <form onSubmit={handleUserFormUpdate} className="space-y-8 mt-4">
              <div>
                <label className="block text-xs font-black uppercase mb-2">Access Authority</label>
                <select 
                  className="w-full p-4 border-4 border-black font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none appearance-none"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  <option value="user">User</option>
                  <option value="moderator">Moderator</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase mb-2">Technical Specialties</label>
                <input 
                  type="text"
                  className="w-full p-4 border-4 border-black font-black text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] outline-none"
                  placeholder="UI, API, SYSTEM"
                  value={form.skills}
                  onChange={(e) => setForm({ ...form, skills: e.target.value })}
                />
              </div>

              <button type="submit" className="w-full py-5 bg-emerald-400 border-4 border-black font-black uppercase italic tracking-widest shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                Commit Changes →
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;