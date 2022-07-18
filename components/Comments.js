import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { useSession } from 'next-auth/react'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Comment from './Comment'

function Comments({ postId }) {
  const [comments, setComments] = useState([])

  useEffect(() => {
    onSnapshot(
        query(collection(db, 'posts', postId, 'comments'), 
        orderBy('timestamp', 'desc')),
        snapshot => setComments(snapshot.docs)    
    )
  }, [db, postId])

  return (
    <div 
    className='mt-3'
    onClick={e => e.stopPropagation()}
    >
      {comments.length > 0 &&
        <div>
          <div className='text-xs md:text-base text-right mb-3 italic'>
            {comments.length} Comments
          </div>
          <div 
            className='max-h-24 md:max-h-44 overflow-hidden hover:overflow-y-auto 
                       pb-2 bg-gray-100 rounded-xl shadow-md hover:shadow-lg'          
          >
            {comments.map(comment => (
              <Comment 
                key={comment.id}
                postId={postId}
                commentId={comment.id}
                uid={comment.data().uid}
                profilePic={comment.data().profilePic}
                name={comment.data().name}
                username={comment.data().username}
                timestamp={comment.data().timestamp}
                cmt={comment.data().comment}
              />
              ))}
          </div>
        </div>
      }
    </div>
  )
}

export default Comments