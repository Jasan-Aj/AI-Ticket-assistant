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
    try {
      if (value.trim() === "") {
        handleError("Reply cannot be empty!");
      } else {
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
          handleError("Failed to update Ticket!");
        }
      }
    } catch (error) {
      handleError("Internal server error");
    }
  };

  const handleError = (message) => {
    setError({ state: true, message });
    setTimeout(() => setError({ state: false, message: "" }), 3000);
  };

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'bg-amber-400';
      case 'Processing': return 'bg-blue-400';
      case 'Completed': return 'bg-emerald-400';
      default: return 'bg-slate-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'bg-rose-500 text-white';
      case 'medium': return 'bg-yellow-400 text-black';
      case 'low': return 'bg-emerald-500 text-white';
      default: return 'bg-slate-800 text-white';
    }
  };

  return (
    <div className="w-full bg-[#FDFCF0] text-black font-sans selection:bg-indigo-300">
      {/* Neo-Brutalist Error Toast */}
      {error.state && (
        <div className='fixed bottom-6 right-6 bg-rose-400 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] px-6 py-4 z-[200] animate-bounce'>
          <p className='font-black uppercase text-sm italic'>⚠ ERROR: {error.message}</p>
        </div>
      )}

      <div className={`transition-all duration-500 ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
        
        {/* Top Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <span className="font-black uppercase text-xs tracking-widest opacity-60">Status</span>
            <span className={`px-4 py-1 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getStatusColor(ticket?.status)}`}>
              {ticket?.status || "Unknown"}
            </span>
          </div>
          <div className="border-4 border-black bg-white p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-between">
            <span className="font-black uppercase text-xs tracking-widest opacity-60">Priority</span>
            <span className={`px-4 py-1 border-2 border-black font-black text-xs uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${getPriorityColor(ticket?.priority)}`}>
              {ticket?.priority || "Normal"}
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="space-y-8">
          {/* Description Block */}
          <section className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-black"></div>
              <h3 className="font-black uppercase text-sm tracking-widest italic">User_Description</h3>
            </div>
            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[120px]">
              <p className="text-xl font-bold leading-tight italic">"{ticket?.description || 'No description provided.'}"</p>
            </div>
          </section>

          {/* AI Insights (If applicable) */}
          {ticket?.aiDescription && (
            <section className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-indigo-600"></div>
                <h3 className="font-black uppercase text-sm tracking-widest italic text-indigo-700">AI_Analysis</h3>
              </div>
              <div className="bg-indigo-50 border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] border-dashed">
                <p className="text-lg font-bold text-indigo-900">{ticket.aiDescription}</p>
              </div>
            </section>
          )}

          {/* Skills Grid */}
          {ticket?.relatedSkills?.length > 0 && (
            <section className="space-y-3">
              <h3 className="font-black uppercase text-xs tracking-[0.2em] opacity-60">Tags_Required:</h3>
              <div className="flex flex-wrap gap-3">
                {ticket.relatedSkills.map((skill, index) => (
                  <span key={index} className="bg-yellow-300 border-2 border-black px-3 py-1 font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    {skill}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Footer Metadata */}
          <div className="pt-8 border-t-4 border-black grid grid-cols-2 gap-4">
            <div>
              <p className="font-black uppercase text-[10px] opacity-50">Assigned_To</p>
              <p className="font-black text-lg underline decoration-blue-500 decoration-4">{ticket?.assignedTo || 'UNASSIGNED'}</p>
            </div>
            <div className="text-right">
              <p className="font-black uppercase text-[10px] opacity-50">Logged_On</p>
              <p className="font-black text-lg">{new Date(ticket?.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Action Area / Form */}
          <div className="pt-6">
            {!isRplyActive ? (
              <button 
                className='w-full bg-black text-white font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(79,70,229,1)] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all tracking-widest' 
                onClick={() => setReplyActive(true)}
              >
                Launch_Reply_Interface
              </button>
            ) : (
              <div className="space-y-4 animate-in slide-in-from-bottom-4 duration-300">
                <div className="flex items-center justify-between">
                    <h3 className="font-black uppercase text-sm tracking-widest italic text-rose-600 underline decoration-2">Drafting_Resolution...</h3>
                    <button 
                        className="font-black uppercase text-xs underline hover:text-rose-600"
                        onClick={() => setReplyActive(false)}
                    >
                        [ Abort ]
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <textarea 
                    className='w-full bg-white border-4 border-black p-4 font-bold text-lg focus:outline-none focus:ring-4 focus:ring-indigo-300 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]'
                    placeholder="Enter resolution details..."
                    rows="4"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                  />
                  <button 
                    type="submit"
                    className='w-full bg-emerald-400 text-black font-black uppercase py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:bg-emerald-500 transition-colors tracking-widest'
                  >
                    Commit_Update
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;