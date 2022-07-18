import { useSession } from 'next-auth/react'
import React, { Fragment, useState } from 'react'
import { PencilIcon, TrashIcon, DotsVerticalIcon } from "@heroicons/react/outline"
import { Menu, Transition } from '@headlessui/react'
import { deleteDoc, doc, updateDoc } from "firebase/firestore"
import { db } from "../firebase"
import { toast } from 'react-hot-toast'
import TimeAgo from 'timeago-react'

function Comment({ uid, postId, commentId, profilePic, name, username, timestamp, cmt }) {
  const { data: session } = useSession()

  const [editing, setEditing] = useState(false)
  const [newComment, setNewComment] = useState(cmt)
  
  const deleteComment = async () => {
    const ok = window.confirm("Are you sure?")
    if (ok) {
      const docRef = doc(db, 'posts', postId, 'comments', commentId)
      await deleteDoc(docRef)
      toast('Comment Deleted!', {
        icon: '🪦'
      })
    }
  }

  const toggleEditing = () => setEditing(prev => !prev)

  const cancelEditing = () => {
    setEditing(prev => !prev)
    
    setNewComment(cmt)
  }

  const editComment = async (e) => {
    e.preventDefault()

    const commentRef = doc(db, 'posts', postId, 'comments', commentId)

    await updateDoc(commentRef, {
        comment: newComment
    })

    setEditing(prev => !prev)

    toast('Comment Edited!', {
      icon: '✏️'
    })
  }

  return (
    <div className='mt-3'>
        {editing ? 
          <>
            <form 
              onSubmit={editComment}
              className='flex gap-x-3 items-center px-3.5 text-sm md:text-base'
            >
              <img 
                src={session.user.image}
                alt='profile pic'
                className='h-8 w-8 rounded-full -mr-2'
              />
              <input 
                type='text'
                placeholder='Add a comment...'
                className='bg-gray-100 rounded-lg p-1 w-full outline-none'
                value={newComment}
                onChange={e => setNewComment(e.target.value)}
                required
                autoFocus
              />   
              <button
                type="submit"
                className='text-[#1DA1F2] cursor-pointer hover:opacity-80
                           disabled:text-gray-400 disabled:cursor-not-allowed'
                disabled={!newComment.trim()}
              >
                Save
              </button>
              <button 
                onClick={cancelEditing} 
                className='text-gray-600 hover:text-black'
              >
                Cancel
              </button>
            </form>
          </>
        :
            <>
              <div 
                className='flex items-center px-2.5'
              >
                  <div className='flex ml-1 items-start gap-x-1.5 flex-1'>
                    <img 
                        src={profilePic}
                        alt='profile pic'
                        className='h-8 md:h-10 w-8 md:w-10 rounded-full object-cover'
                    />
                    <div className='flex flex-col justify-center w-4/5'>
                      <p className='space-x-1 text-xs md:text-sm leading-snug'>
                        <span className='font-bold'>{name}</span>
                        <span className=''>@{username}</span>
                        <span>·</span>
                        <TimeAgo 
                          datetime={timestamp?.toDate()}
                          className='text-[8px] md:text-xs'
                        />
                      </p>
                      <p className='break-all text-xs md:text-base'>{cmt}</p>
                    </div>
                  </div>
                  
                  {uid === session?.user.uid &&
                      <Menu as="div" className='relative' onClick={e => e.stopPropagation()}>
                          <div>
                            <Menu.Button className='text-gray-400 hover:text-black focus:outline-none 
                                                    focus-visible:ring-2 focus-visible:ring-white
                                                    focus-visible:ring-opacity-75'>
                              <DotsVerticalIcon 
                                className='h-4 md:h-5' 
                                aria-hidden='true'
                                />
                            </Menu.Button>
                          </div>
                          <Transition
                            as={Fragment}
                            enter="transition ease-out duration-100"
                            enterFrom="transform opacity-0 scale-95"
                            enterTo="transform opacity-100 scale-100"
                            leave="transition ease-in duration-75"
                            leaveFrom="transform opacity-100 scale-100"
                            leaveTo="transform opacity-0 scale-95"
                            >
                            <Menu.Items className='z-10 absolute right-5 -top-3 md:-top-[15px]
                                                   divide-y divide-gray-100 rounded-md 
                                                   bg-white shadow-lg 
                                                   ring-1 ring-black ring-opacity-5 
                                                   focus:outline-none'>
                              <div className='text-[8px] md:text-[13px]'>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                    className={`${
                                      active ? 'bg-sky-100 text-sky-400' : 'bg-white'
                                    } group flex w-full items-center rounded-md px-1 py-0.5`}
                                    onClick={toggleEditing}
                                    >
                                      <PencilIcon className='h-3 md:h-4 mr-1' aria-hidden='true' />
                                      Edit
                                    </button>
                                  )}
                                </Menu.Item>
                                <Menu.Item>
                                  {({ active }) => (
                                    <button
                                    className={`${
                                      active ? 'bg-amber-100 text-amber-500' : 'bg-white'
                                    } group flex w-full items-center rounded-md px-1 py-0.5`}
                                    onClick={deleteComment}
                                    >
                                      <TrashIcon 
                                        className='h-3 md:h-4 mr-1' 
                                        aria-hidden='true' 
                                        />
                                      Delete
                                    </button>
                                  )}
                                </Menu.Item>
                              </div>
                            </Menu.Items>
                          </Transition>
                      </Menu>
                  }
              </div>      
            </>
        }
    </div>
  )
}

export default Comment