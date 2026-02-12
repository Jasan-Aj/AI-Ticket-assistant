import React, { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import Ticket from '../components/Ticket'

function Tickets() {
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [error, setError] = useState({ state: false, message: "" });
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleError = (message) => {
    setError({ state: true, message });
    setTimeout(() => {
      setError({ state: false, message: "" })
    }, 3000);
  }

  const fetchTickets = useCallback(async (silent = false) => {
    if (silent) setIsSyncing(true);
    else setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket`, {
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
      handleError("Network error.");
    } finally {
      setLoading(false);
      setIsSyncing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className='relative min-h-screen flex flex-col bg-white font-sans text-slate-900'>
      <Navbar title={"My Tickets"} handleError={handleError} />

      {/* Floating Create Button for Mobile */}
      <button 
        onClick={() => navigate("/tickets/create")}
        className='fixed bottom-8 right-8 z-50 bg-amber-400 border-2 border-black w-16 h-16 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center text-3xl font-black hover:-translate-y-1 hover:bg-amber-300 transition-all active:translate-y-1 active:shadow-none'
      >
        +
      </button>

      {error.state && (
        <div className='fixed top-24 right-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg px-6 py-4 z-50'>
          <p className='text-black font-black uppercase text-sm'>{error.message}</p>
        </div>
      )}

      <div className='flex-1 flex flex-col px-8 pt-8 max-w-7xl mx-auto w-full'>
        
        <div className='flex items-end justify-between mb-8 border-b-2 border-black pb-4'>
          <div className='flex items-center gap-4'>
            <div>
              <h1 className='text-3xl font-black uppercase italic tracking-tighter text-slate-900'>Available Tickets</h1>
              <p className='text-slate-500 mt-1 font-bold uppercase text-xs'>Total count: {tickets.length}</p>
            </div>
            
            <button 
              onClick={() => fetchTickets(true)}
              disabled={isSyncing || loading}
              className='bg-white border-2 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-slate-50 transition-all active:translate-y-0.5 active:shadow-none disabled:opacity-50'
              title="Sync Status"
            >
              <svg 
                className={`w-5 h-5 ${isSyncing ? 'animate-spin' : ''}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          <button 
            onClick={() => navigate("/tickets/create")}
            className='hidden md:block bg-blue-600 text-white border-2 border-black px-6 py-2 rounded-xl font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-blue-500 transition-all active:translate-y-0.5 active:shadow-none'
          >
            Create New
          </button>
        </div>

        <div className='pb-20 p-4'> 
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <div className="w-12 h-12 border-4 border-black border-t-amber-400 rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10'>
              {tickets.length > 0 ? (
                tickets.map((ticket) => <Ticket key={ticket._id} ticket={ticket} />)
              ) : (
                <div className='col-span-full py-20 text-center w-full bg-slate-50 border-2 border-black border-dashed rounded-xl'>
                   <p className='text-slate-500 font-bold uppercase'>No tickets found.</p>
                   <button 
                    onClick={() => navigate("/tickets/create")}
                    className='mt-4 text-blue-600 font-black uppercase text-xs hover:underline'
                   >
                     Click here to create your first ticket
                   </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Tickets