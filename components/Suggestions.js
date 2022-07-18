import React, { useEffect, useState } from 'react'
import { faker } from '@faker-js/faker'
import { BadgeCheckIcon } from '@heroicons/react/solid'

function Suggestions() {
  const [suggestions, setSuggestions] = useState([]) 
  
  useEffect(() => {
    const random = [...Array(3)].map((_, i) => ({
      image: faker.image.avatar(),
      name: faker.name.findName(),
      id: i
    }))

    setSuggestions(random)
  }, []) 

  return (
    <div className='bg-gray-100 mt-3 ml-2 rounded-lg'>
        <div className='text-2xl font-bold py-2 px-3.5'>
            Who to follow
        </div>

        {suggestions.map(suggestion => (
            <div 
                key={suggestion.id}
                className='flex gap-x-2 items-center
                          hover:bg-gray-200 p-3 cursor-pointer'
            >
                <img 
                    src={suggestion.image}
                    alt='profilePic'
                    className='h-10 w-10 rounded-full hover:opacity-80'
                />
                <div className='flex-1'>
                    <h1 className='text-sm font-bold flex gap-x-1'>
                        {suggestion.name}
                        <BadgeCheckIcon className='h-5 text-[#1da1f2]' />
                    </h1>
                    <h1 className='text-sm text-gray-500'>@{suggestion.name.split(' ').join('')}</h1>
                </div>
                <h1 className='bg-black text-white p-2 
                               rounded-full px-4 hover:opacity-80'>
                    Follow
                </h1>
            </div>
        ))}

        <div className='text-[#1da1f2] p-3 hover:bg-gray-200 
                        rounded-b-lg cursor-pointer'>Show more</div>
    </div>
  )
}

export default Suggestions