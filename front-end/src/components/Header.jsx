import React from 'react'

function Header({title}) {
  return (
    <div className='bg-gray-300 py-3 text-2xl font-bold text-center'>
        {title}
    </div>
  )
}

export default Header