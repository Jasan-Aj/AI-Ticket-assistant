import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

const TicketDetails = ({ ticket, closeModal, fetchTickets }) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isRplyActive, setReplyActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState({ state: false, message: "" });
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (value.trim() === "") return handleError("Reply cannot be empty!");
    
    setLoading(true);
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
        setIsSuccess(true);
        // Pause to let the user see the "Saved!" animation before closing
        setTimeout(() => {
          setReplyActive(false);
          closeModal();
          fetchTickets();
        }, 1500);
      } else {
        handleError("Failed to update Ticket");
      }
    } catch (error) {
      handleError("Connection Error");
    } finally {
      setLoading(false);
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
      
      {/* Neobrutalist Error Toast */}
      {error.state && (
        <div className='fixed top-6 right-6 bg-red-400 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg px-6 py-4 z-[200] animate-in fade-in slide-in-from-top-4'>
          <p className='text-black font-black uppercase text-xs tracking-widest flex items-center gap-2'>
            <span>⚠</span> {error.message}
          </p>
        </div>
      )}

      <div className={`transition-all duration-500 rounded-3xl overflow-hidden border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] ${isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`}>
        
        {/* Header Bar */}
        <div className="bg-blue-500 border-b-4 border-black p-6 flex justify-between items-center">
          <div className="space-y-1">
            <p className="text-white font-black uppercase text-xs tracking-[0.3em]">Ticket Resolution</p>
            <h1 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tighter leading-none">
              {ticket?.title || "Update Request"}
            </h1>
          </div>
          
        </div>

        {/* Content Section */}
        <div className="p-6 md:p-8 space-y-8 bg-white">
          
          {/* Status and Priority Row */}
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

          {/* AI Analysis Section */}
          {ticket?.aiDescription && (
            <section className="space-y-3">
              <h3 className="font-black uppercase text-xs tracking-widest text-slate-500 italic underline decoration-indigo-500 decoration-4">AI Analysis</h3>
              <div className="bg-indigo-50 border-2 border-black p-6 rounded-2xl shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] border-dashed">
                <p className="text-base font-bold text-slate-800 leading-snug whitespace-break-spaces">
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
                   {!isSuccess && (
                     <button 
                       onClick={() => setReplyActive(false)} 
                       className="text-[13px] font-black uppercase underline cursor-pointer hover:text-black text-slate-500"
                     >
                        Cancel
                     </button>
                   )}
                </div>

                {isSuccess ? (
                  /* Success State Animation */
                  <div className="bg-emerald-400 border-4 border-black p-8 rounded-2xl text-center animate-bounce shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                    <p className="font-black uppercase italic text-2xl">Response Saved!</p>
                  </div>
                ) : (
                  /* Form State */
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <textarea 
                      className='w-full bg-white border-2 border-black p-4 rounded-2xl font-bold text-lg focus:outline-none focus:ring-4 focus:ring-blue-100 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all disabled:opacity-50'
                      placeholder="Describe the solution..."
                      rows="4"
                      disabled={loading}
                      value={value}
                      onChange={(e) => setValue(e.target.value)}
                    />
                    <button 
                      type="submit"
                      disabled={loading}
                      className={`w-full font-black uppercase py-4 rounded-2xl border-2 border-black transition-all flex items-center justify-center gap-3
                        ${loading 
                          ? 'bg-slate-200 cursor-not-allowed shadow-none' 
                          : 'bg-black text-white shadow-[4px_4px_0px_0px_rgba(16,185,129,1)] hover:shadow-none active:translate-y-1'
                        }
                      `}
                    >
                      {loading ? (
                        <>
                          <div className="h-5 w-5 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                          <span>Processing...</span>
                        </>
                      ) : (
                        'Save Response'
                      )}
                    </button>
                  </form>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Footer Meta */}
        <div className="bg-slate-50 border-t-4 border-black p-6 flex justify-between items-center">
          <div>
             <span className="font-black uppercase text-[9px] tracking-widest text-slate-400 italic block">Ticket ID</span>
             <span className="font-mono text-[10px] text-black font-bold">#{ticket?._id?.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex flex-col items-end">
            <span className="font-black uppercase text-[9px] tracking-widest text-slate-400 italic">Logged Date</span>
            <span className="font-black text-xs text-black">
              {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'N/A'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;