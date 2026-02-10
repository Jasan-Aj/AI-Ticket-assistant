import React, { useState } from 'react'

function Navbar({title}) {
    const [isActive, setActive] = useState(false); 
    // Small fix: Added optional chaining and a fallback to prevent crashes if localStorage is empty
    const user = JSON.parse(localStorage.getItem("user")) || { name: "Guest" };

    return (
        <nav className='mx-4 my-4'>
            <div className='relative'>
                {/* Main Nav Bar */}
                <div className='flex bg-blue-500 justify-between h-16 items-center rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'>
                    
                    {/* Logo Section */}
                    <div className='pl-6 text-2xl text-white font-black italic tracking-tighter uppercase'>
                        Tix<span className='text-amber-300'>Flow</span>
                    </div>

                    {/* Page Title */}
                    <div className='hidden md:block font-black text-xl uppercase text-white tracking-widest'>
                        {title}
                    </div>

                    {/* User Profile Section */}
                    <div className='flex items-center pr-6 relative'>
                        <div className='flex items-center gap-3 bg-white/10 py-1.5 px-3 rounded-full border border-white/20'>
                            <p className='text-white font-bold text-sm hidden sm:block'>{user.name}</p>
                            <div 
                                className='bg-amber-300 w-10 h-10 rounded-full flex items-center justify-center text-lg font-black text-black border-2 border-black cursor-pointer hover:bg-amber-400 transition-all hover:scale-105 active:scale-95' 
                                onClick={() => setActive(!isActive)}
                            >
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        </div>
                        
                        {/* Dropdown Menu - Styled with Neobrutalist Vibe */}
                        {isActive && (
                            <div className='absolute top-[calc(100%+12px)] right-0 bg-white border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl py-2 min-w-[160px] z-[100] overflow-hidden'>
                                <div className='px-4 py-2 text-black font-bold text-sm border-b-2 border-slate-100 hover:bg-amber-50 cursor-pointer transition-colors'>
                                    My Tickets
                                </div>
                                <div className='px-4 py-2 text-black font-bold text-sm hover:bg-amber-50 cursor-pointer transition-colors'>
                                    Settings
                                </div>
                                <div 
                                    className='px-4 py-2 text-red-600 font-black text-sm hover:bg-red-50 cursor-pointer border-t-2 border-black transition-colors'
                                    onClick={() => console.log('Logging out...')}
                                >
                                    LOGOUT
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;