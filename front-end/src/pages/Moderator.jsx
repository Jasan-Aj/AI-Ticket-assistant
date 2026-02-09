import React from 'react'
import ModerateTicketsList from '../components/ModerateTicketsList';
import { useState } from 'react';

function Moderator() {

  const user = localStorage.getItem("user");
  const email = user.email;
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTickets = async ()=>{
      setLoading(true);
      try{
        const res = await fetch(`${import.meta.env.VITE_URL}/api/ticket/moderate`,{
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

  return (
    <div className="h-screen flex flex-col bg-gray-50 p-4 md:p-6 overflow-hidden">
      
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Moderator Dashboard</h1>
        <p className="text-gray-600 mt-1">Manage tickets</p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-y-auto">
        <ModerateTicketsList tickets={tickets} />
      </div>
    </div>
  )
}

export default Moderator