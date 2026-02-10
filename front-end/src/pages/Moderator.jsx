import React from 'react'
import ModerateTicketsList from '../components/ModerateTicketsList';
import { useState, useEffect } from 'react';

function Moderator() {

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isActive, setActive] = useState(false); 
  const [error, setError] = useState({state: false, message: ""});

  const fetchTickets = async ()=>{
      setLoading(true);
      try{
        const res = await fetch(`${import.meta.env.VITE_URL}/ticket/moderate`,{
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        });
  
        if(res.ok){
          const ticketsData = await res.json(); 
          setTickets(ticketsData);
          return ticketsData;
        }else{
          handleError("Failed to fetch tickets!");
          return null;
        }
      }catch(error){
        handleError("Failed to fetch tickets!");
      } finally {
        setLoading(false);
      }
    }
  
    useEffect(() => {
      fetchTickets();
    }, []);

    const handleError = (message)=>{
    setError({state:true, message});
    setTimeout(() => {
      setError({state:false, message:""})
    }, 3000);
    }

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4 md:p-6 overflow-hidden">
      
    {
            error.state && (
            <div className='absolute bottom-6 right-6 bg-white shadow-lg border-l-4 border-red-500 rounded-lg px-4 py-4 z-10'>
                <p className='text-red-900 font-semibold'>
                {error.message}
                </p>
            </div>
            )
        }

      <div className="mb-8 flex justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Admin Dashboard</h1>
          <p className="text-gray-600 mt-1">Manage tickets and user accounts</p>
        </div>
        
        <div className='flex items-center pr-9 relative'>
                        <div 
                            className='bg-green-500 w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold text-white cursor-pointer hover:bg-green-600 transition-colors' 
                            onClick={(e) => setActive(!isActive)}
                        >
                            J
                        </div>
                        <p className='text-black ml-2'>{user.name}</p>
                        
                        {/* Dropdown Menu */}
                        {isActive && (
                            <div className='absolute top-full right-8 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-30 z-50 border border-gray-200'>
                                <div className='px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'>
                                    My Tickets
                                </div>
                                <div 
                                    className='px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer border-t border-gray-100'
                                    onClick={() => console.log('Logging out...')}
                                >
                                    Logout
                                </div>
                            </div>
                        )}
                    </div>
                
                  
      </div>

      <div className="bg-white rounded-lg shadow overflow-y-auto">
        <ModerateTicketsList tickets={tickets} />
      </div>
    </div>
  )
}

export default Moderator