import React from 'react'
import Navbar from '../components/Navbar'
import Header from '../components/Header'
import Ticket from '../components/Ticket'

function Tickets() {
  return (
    <div>
      <Navbar title={"My Tickets"} />
      
      <div className='pl-4 pt-5'>
        <div className='flex pl-1'>
          <p className='pr-3'>Availabe Tickets</p>
          <p>count</p>
        </div>
        <div className='pt-5 flex gap-5 flex-wrap'>
          <Ticket/>
          <Ticket/>
          <Ticket/>
        </div>
      </div>
    </div>
  )
}

export default Tickets