import React, { useState, useEffect } from 'react';
import ModerateTicketsList from '../components/ModerateTicketsList';

function Moderator() {
  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const token = localStorage.getItem("token");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setActive] = useState(false);
  const [error, setError] = useState({ state: false, message: "" });

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket/moderate`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (res.ok) {
        const ticketsData = await res.json();
        setTickets(ticketsData);
      } else {
        handleError("Failed to fetch tickets!");
      }
    } catch (error) {
      handleError("Network Error: Could not connect.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleError = (message) => {
    setError({ state: true, message });
    setTimeout(() => {
      setError({ state: false, message: "" });
    }, 3000);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.reload(); // Triggers CheckAuth to redirect to login
  };

  const assignedTickets = tickets.filter((ticket) => {
    return ticket.status  !== "Completed"
  });

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans text-black">
      
      {/* Error Toast - Neo-Brutalist style */}
      {error.state && (
        <div className='fixed top-6 right-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-4 z-[110]'>
          <p className='font-black text-xs uppercase tracking-widest text-red-600'>
            Error: {error.message}
          </p>
        </div>
      )}

      {/* Header Section */}
      <header className="max-w-7xl mx-auto mb-16 flex justify-between items-end border-b-2 border-black pb-8">
        <div>
          <h1 className="text-5xl font-black uppercase tracking-tighter italic">Mod.</h1>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.3em]">Content Moderation Queue</p>
        </div>

        <div className='flex items-center gap-4'>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400">Moderator Access</p>
            <p className="text-sm font-black uppercase border-b-2 border-black inline-block">{user.name}</p>
          </div>

          <div className='relative'>
            <button 
              className='w-12 h-12 border-2 border-black bg-emerald-400 flex items-center justify-center font-black text-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all'
              onClick={() => setActive(!isActive)}
            >
              {user.name ? user.name[0].toUpperCase() : 'M'}
            </button>
            
            {isActive && (
              <div className='absolute top-14 right-0 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-2 min-w-[180px] z-50'>
                <button className='w-full text-left px-4 py-2 text-[10px] font-black uppercase hover:bg-slate-100 transition-colors'>
                  Account Settings
                </button>
                <button 
                  className='w-full text-left px-4 py-2 text-[10px] font-black uppercase text-red-500 hover:bg-red-500 hover:text-white border-t-2 border-black transition-colors'
                  onClick={handleLogout}
                >
                  Logout System →
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400 italic">
            Active Tickets ({assignedTickets.length})
          </h2>
          {loading && (
             <div className="font-black text-[10px] uppercase animate-pulse">Syncing...</div>
          )}
        </div>

        <div className="border-2 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,0.05)] overflow-hidden">
          {tickets.length > 0 ? (
            <ModerateTicketsList tickets={assignedTickets} fetchTickets={fetchTickets}/>
          ) : (
            <div className="p-20 text-center flex flex-col items-center justify-center">
              <div className="w-16 h-1 border-2 border-black mb-4"></div>
              <p className="font-black uppercase text-sm tracking-widest text-slate-300">Queue is Empty</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Moderator;