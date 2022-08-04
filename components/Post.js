import { HeartIcon, ShareIcon, ChatIcon, SwitchHorizontalIcon, TrashIcon } from '@heroicons/react/outline'
import { HeartIcon as HeartIconFilled } from '@heroicons/react/solid'
import { collection, deleteDoc, doc, onSnapshot, setDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db, storage } from '../firebase'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import Comments from './Comments'
import { motion } from 'framer-motion'
import { toast } from 'react-hot-toast'
import TimeAgo from 'timeago-react'
import { deleteObject, ref } from 'firebase/storage'

function Post({ postId, uid, name, username, profilePic, image, caption, timestamp }) {
  const [likes, setLikes] = useState([])
  const [hasliked, setHasLiked] = useState(false)
  const [comment, setComment] = useState("")
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => 
    onSnapshot(collection(db, 'posts', postId, 'likes'),
      snapsnot => setLikes(snapsnot.docs)
  )
  , [db, postId])

  useEffect(() => 
    setHasLiked(likes.findIndex(like => like.id === session?.user.uid) !== -1)
  , [likes])

  const toggleLike = async () => {
    if (hasliked) {
      await deleteDoc(doc(db, 'posts', postId, 'likes', session?.user.uid))
    } else {
      await setDoc(doc(db, 'posts', postId, 'likes', session?.user.uid), {
        username: session?.user.username
      })
    }  
  }
  
  const deletePost = async () => {
    const ok = window.confirm("Are you sure?")
    
    if (ok) {
      await deleteDoc(doc(db, 'posts', postId))
      
      if (image) {
        await deleteObject(ref(storage, `posts/${postId}/image`)) 
      }

      toast('Tweet Deleted!', {
        icon: '🗑️'
      })
    }
  }
  
  const sendComment = e => {
    e.preventDefault()
    addDoc(collection(db, 'posts', postId, 'comments'), {
      uid: session.user.uid,
      profilePic: session.user.image,
      name: session.user.name,
      username: session.user.username,
      timestamp: serverTimestamp(),     
      comment: comment, 
    })
    setComment("")
    setIsOpen(false)

    toast('Comment Posted!', {
      icon: '🎊'
    })
  }

  return (
    <motion.div 
      className='p-5 border-b border-gray-300 cursor-pointer hover:bg-gray-50'
      onClick={() => router.push(`/${postId}`)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }} 
      transition={{ delay: 1 }}
    >
      <div 
        className='flex items-start'
      >
        <div className='flex items-start gap-x-2 flex-1'>
          <img 
            src={profilePic}
            alt='profilePic'
            className='w-10 md:w-12 h-10 md:h-12 rounded-full'
            />
          <div>
            <span className='font-bold mr-1 text-sm md:text-base'>{name}</span>
            <span className='text-gray-600 text-sm md:text-base'>
              @{username}
            </span>
            {caption &&
              <p className='text-base md:text-xl break-all '>{caption}</p>
            }
          </div>
        </div>        
        <TimeAgo 
          className='ml-3 text-gray-600 text-xs md:text-sm'
          datetime={timestamp?.toDate()}
        />      
      </div>

      {image &&
        <img
          src={image}
          alt='tweetImg'
          className='w-2/3 mx-auto my-3 rounded-xl object-contain shadow-xl'
        />
      }

      <div 
        className='mx-auto flex items-center justify-between
                   mt-5 relative'
        onClick={e => e.stopPropagation()}
      >
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className='postBtn rounded-full animation
                     hover:text-sky-400 hover:bg-sky-100'
          >
            <ChatIcon className='postIcon' />
          </button>
      
          {hasliked ? 
            <div 
              className='flex items-center gap-x-0.5 md:gap-x-1 group p-2'
              onClick={toggleLike}
            >
              <button className='p-2 rounded-full group-hover:bg-red-100 animation'>
                <HeartIconFilled  
                  className='postIcon text-red-500' 
                />
              </button>
              {likes.length > 0 && 
                <span 
                  className='text-red-500 text-sm md:text-base mb-0.5'
                >
                  {likes.length}
                </span>
              }
            </div>
          : 
            <div
              className='flex items-center gap-x-1 group p-2'
              onClick={toggleLike} 
            >
              <button 
                className='postBtn rounded-full group-hover:bg-red-100 group-hover:text-red-500
                           animation'
              >
                <HeartIcon 
                  className='postIcon' 
                />
              </button>
              {likes.length > 0 && 
                <span 
                  className='text-gray-500 group-hover:text-red-500 animation'
                >
                  {likes.length}
                </span>
              }
            </div>
        }
      
        <button 
          className='postBtn hover:text-sky-400 rounded-full hover:bg-sky-100
                     animation'
        >
          <ShareIcon className='postIcon' />
        </button>
        
        {uid !== session?.user.uid ?
          <button 
            className='postBtn rounded-full hover:text-lime-600 hover:bg-lime-100
                       animation'
          >
            <SwitchHorizontalIcon className='postIcon' />
          </button>
        : 
          <button 
            className='postBtn rounded-full hover:text-amber-500 hover:bg-amber-100
                       animation'
            onClick={deletePost}
          >
            <TrashIcon className='postIcon' />
          </button>
        }
      </div>
      
      {isOpen && 
            <div 
              onClick={e => e.stopPropagation()}
              className='mt-3'
            >
              <form 
                className='flex gap-x-3 items-center'
              >
                <img 
                  src={session.user.image}
                  alt='profilePic'
                  className='h-[34px] md:h-10 w-[34px] md:w-10 rounded-full'
                />
                <input 
                  type='text'
                  placeholder="Add a comment..."
                  className='bg-gray-100 rounded-lg p-1.5 md:p-2 outline-none
                               w-full shadow-md hover:shadow-lg text-sm md:text-base'
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  required
                  autoFocus
                />   
                <button
                  type="submit"
                  className='text-[#1DA1F2] hover:opacity-80 text-sm md:text-base
                             disabled:text-gray-400 disabled:cursor-not-allowed'
                  onClick={sendComment}
                  disabled={!comment.trim()}
                >
                  Tweet
                </button>
              </form>
            </div>
      }
    
      <Comments postId={postId} />
    </motion.div>
  )
}

export default Post