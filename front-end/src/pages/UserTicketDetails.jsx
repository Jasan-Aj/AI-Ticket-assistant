import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";

const UserTicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isMounted, setIsMounted] = useState(false);
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({ state: false, message: "" });
  
  const token = localStorage.getItem("token");

  const handleError = (message) => {
    setError({ state: true, message });
    setTimeout(() => setError({ state: false, message: "" }), 3000);
  };

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${import.meta.env.VITE_URL}/ticket/${id}`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setTicket(data);
        } else {
          handleError("Ticket Not Found");
        }
      } catch (err) {
        handleError("Connection Error");
      } finally {
        setLoading(false);
        setTimeout(() => setIsMounted(true), 50);
      }
    };
    fetchTicket();
  }, [id, token]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="border-4 border-black p-4 bg-amber-400 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] font-black uppercase italic tracking-widest animate-bounce">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-[#f1f5f9] flex items-center justify-center p-4 md:p-8 font-sans selection:bg-blue-300">
      
      {/* Neobrutalist Error Toast */}
      {error.state && (
        <div className='fixed top-6 right-6 bg-red-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg px-6 py-4 z-50 animate-in fade-in slide-in-from-top-4'>
          <p className='text-black font-black uppercase text-xs tracking-widest flex items-center gap-2'>
            <span>⚠</span> {error.message}
          </p>
        </div>
      )}

      <div 
        className={`w-full max-w-3xl bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden transition-all duration-500 ${
          isMounted ? 'scale-100 opacity-100' : 'scale-90 opacity-0'
        }`}
      >
        {/* Header Bar */}
        <div className="bg-blue-500 border-b-4 border-black p-6 md:p-8 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-white font-black uppercase text-xs tracking-[0.3em]">Ticket Detail</p>
            <h1 className="text-2xl md:text-4xl font-black text-white uppercase italic tracking-tighter">
              {ticket?.title || "Untitled Issue"}
            </h1>
          </div>
          
          <button 
            onClick={() => navigate(-1)}
            className="bg-white border-2 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all active:bg-slate-100"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-8 space-y-10">
          
          {/* Status and ID Row */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-amber-400 border-2 border-black px-4 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              Status: {ticket?.status}
            </div>
            <div className="bg-slate-100 border-2 border-black px-4 py-1 rounded-full font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              ID: {id?.slice(-8).toUpperCase()}
            </div>
          </div>

          {/* Description Block */}
          <section className="space-y-4">
            <h3 className="font-black uppercase text-sm tracking-widest text-slate-800 italic underline decoration-blue-500 decoration-4">Description</h3>
            <div className="bg-slate-50 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-bold text-black leading-relaxed">
                {ticket?.description || "No description provided."}
              </p>
            </div>
          </section>

          {/* Solution Block (Only if exists) */}
          {ticket?.solution && (
            <section className="space-y-4">
              <h3 className="font-black uppercase text-sm tracking-widest text-slate-800 italic underline decoration-green-500 decoration-4">Resolution</h3>
              <div className="bg-green-100 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <p className="text-lg font-bold text-black italic">
                  "{ticket?.solution}"
                </p>
              </div>
            </section>
          )}
        </div>

        {/* Footer Meta */}
        <div className="bg-slate-50 border-t-4 border-black p-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="font-black uppercase text-[10px] tracking-widest text-slate-500">Agent Assigned</span>
            <span className="font-black text-black">{ticket?.assignedTo || "Unassigned"}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-black uppercase text-[10px] tracking-widest text-slate-500">Created At</span>
            <span className="font-black text-black">
              {new Date(ticket?.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserTicketDetails;