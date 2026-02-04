import React, { useState } from 'react'

function Navbar() {
    const [isActive, setActive] = useState(false); 

    return (
        <nav>
            <div className=''>
                <div className='flex bg-blue-600 justify-between h-13 items-center'>
                    <div className='pl-4 text-xl text-white font-semibold'>Logo</div>
                    
                    <div className='flex items-center pr-4 relative'>
                        <div 
                            className='bg-green-500 w-9 h-9 rounded-full flex items-center justify-center text-lg font-semibold text-white cursor-pointer hover:bg-green-600 transition-colors' 
                            onClick={(e) => setActive(!isActive)}
                        >
                            J
                        </div>
                        <p className='text-white ml-2'>Username</p>
                        
                        {/* Dropdown Menu */}
                        {isActive && (
                            <div className='absolute top-full right-0 mt-2 bg-white shadow-lg rounded-lg py-2 min-w-[120px] z-50 border border-gray-200'>
                                <div className='px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'>
                                    Profile
                                </div>
                                <div className='px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer'>
                                    Settings
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