import React from 'react'
import { Link } from 'react-router-dom'

function Ticket({ticket}) {
    
  return (
    <Link className='bg-amber-300 border border-l-0 border-r-3 border-b-3 border-t-0 w-70 rounded-xl text-lg p-2' to={"/usertickets/" + ticket._id} >
        <div className='border-2 border-gray-500 w-full h-full rounded-lg'>
            <div>
                <p className='px-3 py-2 font-semibold'>Title</p>
                <hr className='border border-gray-500 mx-3' />
            </div>
            <div className='p-3 text-sm'>
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
            </div>
            <div className='flex text-sm px-3 pb-2'>
                <p className='pr-2 font-semibold'>Status:</p>
                <p className='font-semibold text-green-700'>Processing</p>
            </div>
        </div>
    </Link>
  )
}

export default Ticket