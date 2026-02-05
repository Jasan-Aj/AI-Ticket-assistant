import React, { useState } from 'react'

function Navbar({title}) {
    const [isActive, setActive] = useState(false); 

    return (
        <nav className='mx-4 my-2'>
            <div>
                <div className='flex bg-blue-500 justify-between h-13 items-center rounded-lg border border-l-0 border-r-3 border-b-3 border-t-0 '>
                    <div className='pl-4 text-xl text-white font-semibold'>Logo</div>
                    <div className='font-semibold text-2xl text-white'>{title}</div>
                    <div className='flex items-center pr-9 relative'>
                        <div 
                            className='bg-green-500 w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold text-white cursor-pointer hover:bg-green-600 transition-colors' 
                            onClick={(e) => setActive(!isActive)}
                        >
                            J
                        </div>
                        <p className='text-white ml-2'>Username</p>
                        
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
            </div>
        </nav>
    );
}

export default Navbar