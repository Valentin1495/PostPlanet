import React from 'react'
import {
  HomeIcon
} from '@heroicons/react/solid'
import {
  HashtagIcon,
  BellIcon,
  InboxIcon,
  BookmarkIcon,
  ClipboardListIcon,
  UserIcon,
  DotsCircleHorizontalIcon,
} from '@heroicons/react/outline'
import { useRouter } from 'next/router'

function Sidebar() {
  const router = useRouter()

  return (
    <div className='min-h-screen col-span-1 xl:col-span-2'>
      <div className='sticky top-2.5'>
        <div className='flex flex-col items-center xl:items-start gap-y-5'>
          <div className='p-1.5 sm:p-3 text-twitter flex 
                          items-center justify-center cursor-pointer
                        hover:bg-sky-100 rounded-full animation'>
            <img
              src='https://upload.wikimedia.org/wikipedia/commons/4/4f/Twitter-logo.svg'
              alt='twitter bird'
              onClick={() => router.push('/')}
              className='h-5 w-5 sm:h-7 sm:w-7'
            />
          </div>
          <button 
            className='navBtn'
            onClick={() => router.push('/')}
          >
            <HomeIcon className='icon text-twitter'/> 
            <p className='font-bold b'>Home</p>
          </button>
          <button className='navBtn'>
            <HashtagIcon className='icon'/>
            <p className='b'>Explore</p>
          </button>
          <button className='navBtn'>
            <BellIcon className='icon'/>
            <p className='b'>Notifications</p>
          </button>
          <button className='navBtn'>
            <InboxIcon className='icon'/>
            <p className='b'>Messages</p>
          </button>
          <button className='navBtn'>
            <BookmarkIcon className='icon'/>
            <p className='b'>Bookmarks</p>
          </button>
          <button className='navBtn'>
            <ClipboardListIcon className='icon'/>
            <p className='b'>Lists</p>
          </button>
          <button className='navBtn'>
            <UserIcon className='icon'/>
            <p className='b'>Profile</p>
          </button>
          <button className='navBtn'>
            <DotsCircleHorizontalIcon className='icon'/>
            <p className='b'>More</p>
          </button>
        </div>

        <button 
          className='hidden xl:ib w- bg-twitter py-3 px-20 rounded-full mt-4
                  text-white text-lg hover:bg-sky-400 font-bold shadow-lg'
        >
          Tweet
        </button>

      </div>
    </div>
  )
}

export default Sidebar