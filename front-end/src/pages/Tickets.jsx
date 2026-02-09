import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Ticket from '../components/Ticket'

function Tickets() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({state: false, message: ""});
  const [tickets, setTickets] = useState([]);
  const token = localStorage.getItem("token");

  const handleError = (message)=>{
    setError({state:true, message});
    setTimeout(() => {
      setError({state:false, message:""})
    }, 3000);
  }

  const fetchTickets = async ()=>{
    setLoading(true);
    try{
      const res = await fetch(`${import.meta.env.VITE_URL}/api/ticket`,{
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

  return (
    
    <div className='relative h-screen flex flex-col overflow-hidden'>
      <Navbar title={"My Tickets"} />
      
      {
            error.state && (
            <div className='absolute bottom-6 right-6 bg-white shadow-lg border-l-4 border-red-500 rounded-lg px-4 py-4 z-10'>
                <p className='text-red-900 font-semibold'>
                {error.message}
                </p>
            </div>
            )
        }
     
      <div className='flex-1 flex flex-col px-4 pt-5 overflow-hidden'>
        <div className='flex pl-1 pb-4'>
          <p className='pr-3'>Available Tickets</p>
          <p>{tickets.length}</p>
        </div>
        
        <div className='flex-1 overflow-y-auto pb-4'>
          <div className='flex gap-5 flex-wrap'>
            {
              tickets.map((ticket)=> <Ticket ticket={ticket} />)
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default Tickets