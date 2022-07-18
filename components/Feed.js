import React from 'react'
import Tweet from './Tweet'
import Posts from './Posts'
// import { useTheme } from 'next-themes'
// import { SunIcon, MoonIcon } from '@heroicons/react/solid'

function Feed() {
  // const {theme, setTheme} = useTheme()

  return (
    <div className='border-r border-l border-gray-300 col-span-9
                    lg:col-span-5 xl:col-span-5 '>
      <div className='font-bold text-lg lg:text-xl sticky top-0 
                      py-3 pl-2 bg-white z-50'>
        Home
      </div>
     
      
      <Tweet />
      <Posts />   
       
      {/* {theme === 'light' ? 
          <button 
            className='mr-2 hover:cursor-pointer'
            onClick={() => setTheme('dark')}
          >
            <SunIcon className='h-6 text-[#1da1f2]' />
          </button>
        :
          <button 
            className='mr-2 hover:cursor-pointer'
            onClick={() => setTheme('light')}
          >
            <MoonIcon className='h-6 text-[#1da1f2]' />
          </button>
        } */}
    </div>
  )
}

export default Feed