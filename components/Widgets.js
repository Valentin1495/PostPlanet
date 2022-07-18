import { LogoutIcon, SearchIcon } from '@heroicons/react/outline'
import { signOut, useSession } from 'next-auth/react'
import React from 'react'
import { TwitterTimelineEmbed } from 'react-twitter-embed'
import Suggestions from './Suggestions'

function Widgets() {
  const { data: session } = useSession()

  return (
    <div className='hidden mb-5 lg:block lg:col-span-4 xl:col-span-3 '>
      <div className='sticky top-0 py-3 bg-white'>
        <div className='flex items-center bg-gray-100 gap-x-2 
                        p-2 rounded-full ml-2'>
          <SearchIcon className='h-5 text-gray-500'/>
          <input 
            type='text'
            placeholder='Search Twitter'
            className='bg-transparent flex-1 outline-none text-gray-700'
          />
        </div>

        <div className='flex gap-x-5 items-center mt-5'>
          <div className='flex items-center gap-x-2 flex-1 pl-2'>
            <img 
              src={session?.user.image}
              alt='profilePic'
              className='h-8 md:h-10 w-8 md:w-10 rounded-full 
                         cursor-pointer hover:opacity-80'
              onClick={signOut}
            />
            <h1 className='-mr-1 font-bold'>{session?.user.name}</h1>
            <h2>{`@${session?.user.username}`}</h2>
          </div>
          <button className='p-2 rounded-full navBtn'>
            <LogoutIcon className='h-7' onClick={signOut} />
          </button>
        </div>
      </div>

      <div className='ml-2 border border-gray-200 rounded-md'>
        <TwitterTimelineEmbed 
          sourceType='profile'
          screenName='elonmusk'
          options={{height:1000}}
        />
      </div>
      
      <Suggestions />
    </div>
  )
}

export default Widgets