import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { db } from '../firebase'
import Post from './Post'

function Posts() {
    const [posts, setPosts] = useState([])
    
    useEffect(() => 
      onSnapshot(query(collection(db, 'posts'),orderBy('timestamp', 'desc')),
        snapshot => setPosts(snapshot.docs))
    , [db])
    
    return (
    <div>
      {posts.map(post => (
        <Post 
          key={post.id}
          postId={post.id}
          uid={post.data().uid}
          name={post.data().name}
          username={post.data().username}
          profilePic={post.data().profilePic}
          image={post.data().image}
          caption={post.data().caption}
          timestamp={post.data().timestamp}
        />
      ))}   
    </div>
  )
}

export default Posts