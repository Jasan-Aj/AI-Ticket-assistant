import React, { useState, useEffect } from 'react';
import {useParams} from "react-router-dom"

const UserTicketDetails = () => {
  const [isMounted, setIsMounted] = useState(false);
  const id = useParams().toString();
  const token = localStorage.getItem("token");
  const [ticket, setTicket] = useState({});
  const [error, setError] = useState({state: false, message: ""});

  const handleError = (message)=>{
    setError({state:true, message});
    setTimeout(() => {
      setError({state:false, message:""})
    }, 3000);
  }

  const fetchTicket = async ()=>{
    try{
      const res = await fetch(`${import.meta.env.VITE_URL}/ticket/${id}`,{
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if(res.ok){
        const data = await res.json();
        setTicket(data);
      }else{
        handleError("Failed to fetch ticket!");
      }

    }catch(error){
      handleError("Failed to fetch ticket!");
    }
  }

  useEffect(() => {
    setIsMounted(true);
    fetchTicket();
  }, []);

  // Helper function to format dates (handles both Date objects and strings)
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    const date = new Date(dateInput);
    if (isNaN(date.getTime())) return 'Invalid Date';
    
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Status badge configuration
  const getStatusConfig = (status) => {
    switch (status) {
      case 'Pending':
        return {
          bg: 'bg-yellow-600/10',
          text: 'text-yellow-700',
          border: 'border-yellow-500/30',
          glow: 'shadow-[0_0_20px_rgba(234,179,8,0.3)]',
          pulse: 'animate-pulse'
        };
      case 'Processing':
        return {
          bg: 'bg-blue-500/10',
          text: 'text-blue-600',
          border: 'border-blue-500/30',
          glow: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
          pulse: ''
        };
      case 'Completed':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-600',
          border: 'border-green-500/30',
          glow: 'shadow-[0_0_20px_rgba(34,197,94,0.3)]',
          pulse: ''
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-600',
          border: 'border-gray-500/30',
          glow: '',
          pulse: ''
        };
    }
  };

  // Priority badge configuration
  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return {
          bg: 'bg-red-500/10',
          text: 'text-red-600',
          border: 'border-red-500/30',
          level: '1',
          label: 'High'
        };
      case 'medium':
        return {
          bg: 'bg-orange-500/10',
          text: 'text-orange-600',
          border: 'border-orange-500/30',
          level: '2',
          label: 'Medium'
        };
      case 'low':
        return {
          bg: 'bg-green-500/10',
          text: 'text-green-500',
          border: 'border-green-500/30',
          level: '3',
          label: 'Low'
        };
      default:
        return {
          bg: 'bg-gray-500/10',
          text: 'text-gray-600',
          border: 'border-gray-500/30',
          level: '?',
          label: 'Unknown'
        };
    }
  };

  // Skill chip colors (cycling through colors)
  const getSkillColor = (index) => {
    const colors = [
      'bg-purple-100 text-purple-800 border-purple-300 hover:bg-purple-200',
      'bg-blue-100 text-blue-800 border-blue-300 hover:bg-blue-200',
      'bg-green-100 text-green-800 border-green-300 hover:bg-green-200',
      'bg-yellow-100 text-yellow-800 border-yellow-300 hover:bg-yellow-200',
      'bg-pink-100 text-pink-800 border-pink-300 hover:bg-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-300 hover:bg-indigo-200',
      'bg-teal-100 text-teal-800 border-teal-300 hover:bg-teal-200',
      'bg-rose-100 text-rose-800 border-rose-300 hover:bg-rose-200'
    ];
    return colors[index % colors.length];
  };

  const statusConfig = getStatusConfig(ticket?.status);
  const priorityConfig = getPriorityConfig(ticket?.priority);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6 flex items-center justify-center">
      {/* Scrollbar Hide Styles */}
      <style jsx global>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>

      {
            error.state && (
            <div className='absolute bottom-6 right-6 bg-white shadow-lg border-l-4 border-red-500 rounded-lg px-4 py-4 z-10'>
                <p className='text-red-900 font-semibold'>
                {error.message}
                </p>
            </div>
            )
        }
      
      {/* Main Ticket Container */}
      <div 
        className={`w-full max-w-4xl h-[90vh] bg-gray-800 rounded-3xl shadow-2xl transform transition-all duration-500 ${isMounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-100'}`}
        style={{
          // Paper texture effect
          backgroundImage: `
            linear-gradient(to bottom right, 
              rgba(255,255,255,0.9) 0%, 
              rgba(248,250,252,0.95) 100%
            ),
            url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm56-76c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-6 60c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm29 22c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zM32 63c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm57-13c2.76 0 5-2.24 5-5s-2.24-5-5-5-5 2.24-5 5 2.24 5 5 5zm-9-21c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM60 91c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM35 41c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 60c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2z' fill='%23f1f5f9' fill-opacity='0.4' fill-rule='evenodd'/%3E%3C/svg%3E")
          `,
          // 3D fold shadows
          boxShadow: `
            0 20px 60px rgba(0, 0, 0, 0.1),
            inset 20px -20px 40px rgba(0, 0, 0, 0.03),
            inset -20px 20px 40px rgba(255, 255, 255, 0.5)
          `
        }}
      >
        {/* Perforated Edges */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[80%] flex flex-col justify-between">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`left-${i}`}
              className="w-4 h-4 rounded-full border border-gray-600 bg-gray-800"
            />
          ))}
        </div>
        
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-[80%] flex flex-col justify-between">
          {[...Array(20)].map((_, i) => (
            <div 
              key={`right-${i}`}
              className="w-4 h-4 rounded-full border border-gray-600 bg-gray-800"
            />
          ))}
        </div>

        {/* Ticket Content - Scrollbar hidden here */}
        <div className="h-full flex flex-col p-6 md:p-10 overflow-y-auto scrollbar-hide">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
            <div className="flex-1 mb-6 md:mb-0">
              <h1 
                className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 tracking-tight"
                aria-label={`Ticket title: ${ticket?.title}`}
              >
                {ticket?.title || 'Untitled Ticket'}
              </h1>
              
              {/* Badges Container */}
              <div className="flex flex-wrap gap-3">
                {/* Status Badge */}
                <div 
                  className={`inline-flex items-center px-4 py-2 rounded-full border ${statusConfig.border} ${statusConfig.bg} ${statusConfig.glow} ${statusConfig.pulse} transition-all duration-300 hover:scale-105`}
                  role="status"
                  aria-label={`Status: ${ticket?.status}`}
                >
                  <span className={`text-sm font-semibold ${statusConfig.text}`}>
                    {ticket?.status}
                  </span>
                </div>

                {/* Priority Badge */}
                <div 
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${priorityConfig.border} ${priorityConfig.bg} transition-all duration-300 hover:scale-105`}
                  role="priority"
                  aria-label={`Priority: ${priorityConfig.label}`}
                >
                  <span className={`text-sm font-semibold ${priorityConfig.text}`}>
                    Priority: {priorityConfig.label}
                  </span>
                  <span className={`text-xs font-bold px-2 py-1 rounded ${priorityConfig.bg} ${priorityConfig.text}`}>
                    {priorityConfig.level}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-8 mb-10">
            {/* Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">
                Description
              </h2>
              <p className="text-gray-600  leading-relaxed text-lg">
                {ticket?.description || 'No description provided.'}
              </p>
            </div>
          </div>

          {/* Skills Section - Scrollbar hidden here */}
          {ticket?.relatedSkills && ticket.relatedSkills.length > 0 && (
            <div className="mb-10">
              <h3 className="text-xl font-semibold text-gray-600 mb-4">
                Required Skills
              </h3>
              <div 
                className="flex overflow-x-auto pb-4 gap-3 scrollbar-hide"
                style={{
                  // Additional scrollbar hiding for cross-browser compatibility
                  WebkitOverflowScrolling: 'touch',
                }}
              >
                {ticket.relatedSkills.map((skill, index) => (
                  <span
                    key={index}
                    className={`flex-shrink-0 px-4 py-2 rounded-full border ${getSkillColor(index)} transition-all duration-300 hover:scale-105 cursor-pointer`}
                    role="button"
                    tabIndex={0}
                    aria-label={`Skill: ${skill}`}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        // Handle skill click
                        console.log(`Skill clicked: ${skill}`);
                      }
                    }}
                  >
                    <span className="font-medium">{skill}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="pt-6 border-t border-gray-700 ">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Assigned To */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Assigned To
                </h4>
                <p className="text-lg font-medium text-gray-700">
                  {ticket?.assignedTo || 'Unassigned'}
                </p>
              </div>

              {/* Dates */}
              <div className="space-y-3">
                
                <div>
                  <h4 className="text-sm font-semibold text-gray-700  uppercase tracking-wider mb-1">
                    Created
                  </h4>
                  <p className="text-gray-800">
                    {formatDate(ticket?.createdAt)}
                  </p>
                </div>
              </div>
                            
            </div>

            { ticket.status === "Completed" && <div className="space-y-8 mt-10 mb-10">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-gray-700">
                  Solution
                </h2>
                <p className="text-gray-600  leading-relaxed text-lg">
                  {ticket?.description || 'No description provided.'}
                </p>
              </div>
            </div>}
          </div>
        </div>
      </div>
    </div>
  );
};



export default UserTicketDetails;
