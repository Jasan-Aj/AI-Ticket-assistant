import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const TicketDetails = ({ ticket, closeModal, fetchTickets }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isRplyActive, setReplyActive] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState({ state: false, message: "" });
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (value.trim() === "") return handleError("Reply cannot be empty!");
    
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket/update/${ticket._id}`, {
        method: "POST",
        headers: { 
          "Authorization" : `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ response: value })
      });

      if (res.ok) {
        setReplyActive(false);
        closeModal();
        fetchTickets();
      } else {
        handleError("Failed to update Ticket");
      }
    } catch (error) {
      handleError("Connection Error");
    }
  };

  const handleError = (message) => {
    setError({ state: true, message });
    setTimeout(() => setError({ state: false, message: "" }), 3000);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <div className="w-full bg-white font-sans selection:bg-blue-200">
      
      {/* Error Toast */}
      {error.state && (
        <div className='fixed top-6 right-6 bg-red-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg px-6 py-4 z-[200] animate-in fade-in slide-in-from-top-4'>
          <p className='text-black font-black uppercase text-xs tracking-widest flex items-center gap-2'>
            <span>⚠</span> {error.message}
          </p>
        </div>
      )}

      <div className={`transition-all duration-500 rounded-3xl overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Header Bar - Matching UserTicketDetails */}
        <div className="bg-blue-500 border-b-4 border-black p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-white font-black uppercase text-xs tracking-[0.3em]">Ticket Resolution</p>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
              {ticket?.title || "Update Request"}
            </h1>
          </div>
          <button 
            onClick={closeModal}
            className="bg-white border-2 border-black p-2 rounded-xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-8 bg-white">
          
          {/* Status and ID Row */}
          <div className="flex flex-wrap gap-4">
            <div className="bg-amber-400 border-2 border-black px-4 py-1 rounded-full font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              STATUS: {ticket?.status}
            </div>
            <div className="bg-slate-100 border-2 border-black px-4 py-1 rounded-full font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              PRIORITY: {ticket?.priority || "Medium"}
            </div>
          </div>

          {/* Description Block */}
          <section className="space-y-3">
            <h3 className="font-black uppercase text-xs tracking-widest text-slate-500 italic underline decoration-blue-500 decoration-4">Issue Description</h3>
            <div className="bg-slate-50 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <p className="text-lg font-bold text-black leading-relaxed italic">
                "{ticket?.description}"
              </p>
              <p className="mt-4 text-[10px] font-black uppercase text-blue-600">— Reported by {ticket?.createdBy?.name || 'User'}</p>
            </div>
          </section>

          {/* AI Section (If exists) */}
          {ticket?.aiDescription && (
            <section className="space-y-3">
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-500 italic underline decoration-indigo-500 decoration-4">AI Analysis</h3>
              <div className="bg-indigo-50 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-dashed">
                <p className="text-base font-bold text-slate-800 leading-snug">
                  {ticket.aiDescription}
                </p>
              </div>
            </section>
          )}

          {/* Reply Interface */}
          <div className="pt-4">
            {!isRplyActive ? (
              <button 
                className='w-full bg-emerald-400 text-black font-black uppercase py-4 rounded-2xl border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all tracking-widest' 
                onClick={() => setReplyActive(true)}
              >
                Write Response →
              </button>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-2 duration-300">
                <div className="flex justify-between items-center">
                   <h3 className="font-black uppercase text-xs tracking-widest text-rose-500 italic">Resolution Entry</h3>
                   <button onClick={() => setReplyActive(false)} className="text-[13px] font-black uppercase underline cursor-pointer">Cancel</button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea 
                    className='w-full bg-white border-2 border-black p-4 rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'
                    placeholder="Describe the solution..."
                    rows="4"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className='w-full bg-black text-white font-black uppercase py-4 rounded-2xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] hover:shadow-none transition-all'
                  >
                    Save Response
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="bg-slate-50 border-t-4 border-black p-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            
          </div>
          <div className="flex flex-col items-end">
            <span className="font-black uppercase text-[9px] tracking-widest text-slate-400 italic">Logged Date</span>
            <span className="font-black text-xs text-black">
              {new Date(ticket?.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;