import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({ state: false, message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleError = (message) => {
    setError({ state: true, message });
    setTimeout(() => { setError({ state: false, message: "" }) }, 3000);
  }
  
  const validateForm = () => {
    if (!formData.title.trim()) {
      handleError('Title is required');
      return false;
    } else if (formData.title.length < 3) {
      handleError('Title must be at least 3 characters'); 
      return false; 
    }
    if (!formData.description.trim()) {
      handleError('Description is required');
      return false;
    } else if (formData.description.length < 10) {
      handleError('Description must be at least 10 characters');
      return false;
    }
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else {
        handleError("Failed to create new ticket");
      }
    } catch (error) {
      handleError("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };
  
  const handleReset = () => {
    setFormData({ title: '', description: '' });
    setError({ state: false, message: "" });
  };
  
  return (
    <div className="min-h-screen bg-white py-12 px-4 flex items-center justify-center font-sans">
      
      {/* Neobrutalist Error Toast */}
      {error.state && (
        <div className='fixed top-6 right-6 bg-white border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-lg px-6 py-4 z-50'>
          <p className='text-black font-black uppercase text-xs tracking-widest'>{error.message}</p>
        </div>
      )}

      <div className="max-w-2xl w-full">
        <div className="mb-8 text-left">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 font-black uppercase text-xs tracking-widest hover:underline flex items-center gap-2"
          >
            ← Back to Tickets
          </button>
          <h2 className="text-5xl font-black text-black uppercase italic tracking-tighter">
            New Ticket
          </h2>
          <p className="text-slate-500 font-bold uppercase text-xs mt-2">
            Log a new issue in the system
          </p>
        </div>
        
        <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] rounded-3xl overflow-hidden">
          <div className="p-8 sm:p-10">
            {isSubmitted ? (
              <div className="text-center py-10 animate-bounce">
                <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-400 border-4 border-black mb-6">
                  <svg className="h-10 w-10 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-3xl font-black uppercase tracking-tighter">Created!</h3>
                <p className="text-slate-500 font-bold uppercase text-xs mt-2">Redirecting you home...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title Field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="title" className="font-black uppercase text-xs tracking-widest text-black pl-1">
                    Ticket Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="title"
                    name="title"
                    type="text"
                    value={formData.title}
                    onChange={handleChange}
                    className="border-2 border-black rounded-xl p-4 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400 transition-all text-black font-bold placeholder:text-slate-400"
                    placeholder="e.g., Server is down in Region B"
                  />
                  <div className="flex justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Short & Descriptive</span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">{formData.title.length}/100</span>
                  </div>
                </div>
                
                {/* Description Field */}
                <div className="flex flex-col gap-2">
                  <label htmlFor="description" className="font-black uppercase text-xs tracking-widest text-black pl-1">
                    Detailed Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    className="border-2 border-black rounded-xl p-4 bg-slate-50 focus:bg-white focus:outline-none focus:ring-4 focus:ring-amber-400 transition-all text-black font-bold resize-none placeholder:text-slate-400"
                    placeholder="Please describe the steps to reproduce..."
                  />
                  <div className="flex justify-between px-1">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Be specific</span>
                    <span className={`text-[10px] font-bold uppercase ${formData.description.length > 500 ? 'text-red-500' : 'text-slate-400'}`}>
                      {formData.description.length}/500
                    </span>
                  </div>
                </div>
                
                {/* Form Actions */}
                <div className="flex flex-col sm:flex-row gap-6 pt-4">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="flex-1 border-2 border-black rounded-xl py-4 font-black uppercase tracking-widest text-sm hover:bg-slate-100 transition-all active:translate-y-1"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-amber-400 border-2 border-black rounded-xl py-4 font-black uppercase tracking-widest text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-amber-300 transition-all active:translate-y-1 active:shadow-none disabled:opacity-50"
                  >
                    {loading ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTicket;