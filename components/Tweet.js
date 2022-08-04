import React, { useState, useRef } from 'react'
import { useSession } from 'next-auth/react'
import {
  PhotographIcon,
  ChartBarIcon,
  CalendarIcon,
  PlusCircleIcon,
} from '@heroicons/react/outline'
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db, storage } from '../firebase'
import { getDownloadURL, ref, uploadString } from 'firebase/storage'
import toast from 'react-hot-toast'

function Tweet() {
  const { data: session } = useSession() 
  
  const fileInputRef = useRef()
  const filePickerRef = useRef()
  
  const [file, setFile] = useState()
  const [caption, setCaption] = useState("")
  const [loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  
  const plusImage = (e) => {
      const reader = new FileReader()
    
      if (e.target.files[0]) {
        reader.readAsDataURL(e.target.files[0])
      }
      
      reader.onload = (e) => {
        setFile(e.target.result)
      }

      e.target.value = ''
      setIsOpen(false)
  }

  const addImage = (e) => {
    e.preventDefault()

    const input =  fileInputRef.current?.value.trim()
    
    const reader = new FileReader()

    if (input) {
      fetch(input)
      .then(res => res.blob())
      .then(blob => reader.readAsDataURL(blob))
      
      reader.onload = (e) => {
        setFile(e.target.result)
      }

      setIsOpen(false)
    }
  }

  const sendPost = async () => {
    setLoading(true)
    
    const document = await addDoc(collection(db, 'posts'), {
      uid: session?.user.uid,
      name: session?.user.name,
      username: session?.user.username,
      profilePic: session?.user.image,
      caption: caption,
      timestamp: serverTimestamp(),
    })

    if (file) {     
      const imgRef = ref(storage, `posts/${document.id}/image`)
      
      await uploadString(imgRef, file, 'data_url').then(async () => {
        const downloadUrl = await getDownloadURL(imgRef)
        
        await updateDoc(doc(db, 'posts', document.id), {
          image: downloadUrl
        })
      })

      setFile()
    }

    setCaption("")
    setIsOpen(false)
    setLoading(false)
    toast('Tweet Posted!', {
      icon: '🎉'
    })
  }

  return (
    <div 
      className={`p-3 sticky top-[52px] bg-white z-10
                  ${loading && 'opacity-60 pointer-events-none'} border-b border-gray-300`}
    >
      <div className='flex space-x-3 mt-1 items-start'>
        <img
          src={session?.user.image}
          alt='profilePic'
          className='h-12 md:h-14 w-12 md:w-14 rounded-full'
        />
        <textarea
          value={caption}
          onChange={e => setCaption(e.target.value)}
          rows="2"
          placeholder="What's happening?"
          className='w-full bg-gray-100 rounded-lg px-1.5 pt-1 md:px-2 md:pt-0.5
                     text-sm md:text-lg scrollbar-hide tracking-wide 
                     min-h-[50px] md:min-h-[60px] outline-none'
          autoFocus
        />
      </div>

      {!loading && 
        <div className='flex items-center pt-3 ml-16'>
          <div className='flex-1 space-x-3'>
            <button className='tweetBtn btn'>
              <PhotographIcon 
                className='tweetIcon'
                onClick={() => {
                  setIsOpen(!isOpen)
                }}
              />
            </button>
            <button className='tweetBtn btn rotate-90'>
              <ChartBarIcon className='tweetIcon' />
            </button>
            <button className='tweetBtn btn'>
              <CalendarIcon className='tweetIcon' />
            </button>
          </div>
          <button
            type='button'
            className='bg-twitter px-3.5 md:px-4 py-1 mt-auto rounded-full 
            text-white text-xs md:text-base font-bold shadow-lg cursor-pointer 
            hover:bg-sky-400 disabled:bg-gray-300 disabled:cursor-not-allowed'
            onClick={sendPost}
            disabled={!file && !caption.trim()}
          >
            Tweet
          </button>
        </div>
      }

      {isOpen && 
  
        <div className='flex items-center gap-x-2'>
          <form
            className='bg-[#1da1f2] ml-[66px] mt-3 rounded-md
                      p-1 md:p-2 flex-1 flex items-center gap-x-2.5 shadow-lg'
          >
            <input 
              type='text'
              ref={fileInputRef}
              placeholder='Enter Image URL...'
              className='bg-transparent placeholder:text-white
                         flex-1 p-1 md:p-2 text-white placeholder:text-xs
                         md:placeholder:text-base text-xs md:text-base 
                         outline-none'
              autoFocus
            />
            <button
              type='submit'
              className='text-white mr-0.5 md:mr-1.5 font-semibold md:font-bold
                         text-[10px] md:text-base'
              onClick={addImage}
            >
              Add
            </button>
          </form>

          <div className='mt-[18px]'>
            <input 
              type='file'
              className='hidden'
              ref={filePickerRef}
              onChange={plusImage}
            />
            <button className='text-twitter hover:opacity-80'>
              <PlusCircleIcon 
                className='h-6 md:h-8' 
                onClick={() => filePickerRef.current.click()}
              />
            </button>
          </div>
        </div>
      }

      {file &&
        <div className='flex items-center justify-center mt-2'>
          <img
            src={file}
            alt='Please select a right file'
            className='w-2/3 my-3 rounded-xl object-contain cursor-pointer
                        hover:opacity-90 shadow-lg'
            onClick={() => setFile(null)}
          />
        </div> 
      }
    </div>
  )
}

export default Tweet