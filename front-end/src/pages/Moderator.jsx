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
    window.location.reload(); 
  };

  const assignedTickets = tickets.filter((ticket) => {
    return ticket.status !== "Completed"
  });

  return (
    <div className="min-h-screen bg-[#FDFCF0] p-4 md:p-8 font-sans text-black">
      
      {/* Error Toast - Neo-Brutalist style */}
      {error.state && (
        <div className='fixed bottom-10 right-10 bg-rose-400 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-6 py-4 z-[110] animate-bounce'>
          <p className='font-black text-sm uppercase italic tracking-wider'>
            {error.message}
          </p>
        </div>
      )}

      {/* Header Section */}
      <header className="max-w-6xl mx-auto mb-10 flex justify-between items-center">
        <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -rotate-1">
          <h1 className="text-4xl font-black uppercase italic leading-none">Moderator</h1>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] mt-1 text-indigo-600">Review Authority</p>
        </div>

        <div className='flex items-center gap-4'>
          <div className="hidden md:block text-right">
            <p className="text-[10px] font-black uppercase tracking-tighter leading-none mb-1 text-slate-500">Active Session</p>
            <p className="text-sm font-black uppercase italic border-b-2 border-black inline-block">{user.name || 'Moderator'}</p>
          </div>

          <div className='relative'>
            <button 
              className='w-14 h-14 border-4 border-black bg-emerald-400 flex items-center justify-center font-black text-2xl cursor-pointer shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all'
              onClick={() => setActive(!isActive)}
            >
              {user.name ? user.name[0].toUpperCase() : 'M'}
            </button>
            
            {isActive && (
              <div className='absolute top-16 right-0 bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] py-2 min-w-[200px] z-50'>
                <div className="md:hidden px-4 py-2 border-b-2 border-black bg-slate-50">
                  <p className="text-[8px] font-black uppercase text-slate-400">User</p>
                  <p className="text-xs font-black uppercase">{user.name}</p>
                </div>
                <button className='w-full text-left px-4 py-3 text-black font-black text-xs uppercase hover:bg-yellow-300 transition-colors cursor-pointer'>
                  Account Settings
                </button>
                <button 
                  className='w-full text-left px-4 py-3 text-black font-black text-xs uppercase hover:bg-rose-400 transition-colors cursor-pointer border-t-4 border-black'
                  onClick={handleLogout}
                >
                  Sign Out →
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto">
        <div className="flex flex-wrap gap-4 mb-10">
            <div className="px-8 py-3 border-4 border-black bg-indigo-500 text-white font-black uppercase italic tracking-wider shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Assigned Queue ({assignedTickets.length})
            </div>
            {loading && (
                <div className="px-8 py-3 border-4 border-black bg-yellow-300 font-black uppercase italic animate-pulse">
                    Syncing Data...
                </div>
            )}
        </div>

        <div className="bg-white border-4 border-black shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] overflow-hidden min-h-[400px]">
          {tickets.length > 0 ? (
            <div className="p-6">
                <ModerateTicketsList tickets={assignedTickets} fetchTickets={fetchTickets}/>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-[400px]">
                <div className="border-4 border-dashed border-black p-10 flex flex-col items-center">
                    <p className="font-black uppercase italic text-4xl text-slate-200">Zero Pending</p>
                    <p className="text-[12px] font-bold mt-2 uppercase tracking-widest text-slate-400">All content has been moderated</p>
                </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Moderator;