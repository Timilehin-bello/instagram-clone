import React, { useEffect, useState } from 'react';
import './App.css';
import Post from './component/Post/Post';
import { db } from './firebase/firebase';


function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, [])


  const imageHeaderUrl = 'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
  return (
    <div className="app">
      <div className="app__header">
        <img 
          className="app__headerImage"
          src={imageHeaderUrl} 
          alt="instagram"
        />
      </div>
        <h1>Hello TimmyDev</h1>
        {
          posts.map(({id, post}) => (
            <Post key={id} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
          ))
        }

       
    </div>
  );
}

export default App;
