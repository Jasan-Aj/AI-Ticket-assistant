import React from 'react'
import { Link } from 'react-router-dom'

function Ticket({ticket}) {
  return (
    <Link 
      className='group block w-72 transition-transform hover:-translate-y-1 hover:-translate-x-1' 
      to={"/usertickets/" + ticket._id} 
    >
        {/* The Main Card with a crisp Black Border */}
        <div className='bg-white border-2 border-black w-full h-full rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all'>
            
            {/* Header Section */}
            <div className='bg-amber-300 border-b-2 border-black'>
                <p className='px-3 py-2 font-black uppercase text-sm tracking-tight'>
                    {ticket.title}
                </p>
            </div>

            {/* Content Section - Kept exactly as you had it */}
            <div className='p-3 text-sm font-medium border-b-2 border-black min-h-[60px]'>
                {ticket.title}
            </div>

            {/* Status Footer */}
            <div className='flex items-center text-sm px-3 py-2 bg-slate-50'>
                <p className='pr-2 font-bold'>Status:</p>
                <p className='font-black text-green-700 uppercase italic'>
                    {ticket.status}
                </p>
            </div>
        </div>
    </Link>
  )
}

export default Ticket