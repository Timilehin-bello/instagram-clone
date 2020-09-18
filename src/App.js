import { Button, Input, makeStyles, Modal } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import './App.css';
import ImageUpload from './component/ImageUpload/ImageUpload';
import Post from './component/Post/Post';
import { auth, db } from './firebase/firebase';
import InstagramEmbed from 'react-instagram-embed';


function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}



const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '1px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3)
  },
}));



function App() {
  const classes =useStyles();
  const [posts, setPosts] = useState([]);
  const [open, setOpen] = useState(false);
  const [openSignin, setOpenSignin] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [modalStyle] = useState(getModalStyle);
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubsribe = auth.onAuthStateChanged((authUser) => {
      if(authUser) {
        console.log(authUser);
        setUser(authUser);

      } else {
        setUser(null)
      }
    })
    return () => {
      unsubsribe()
    }
  }, [user, username])


  useEffect(() => {
    db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })));
    })
  }, []);

  const signUp = (event) => {
    event.preventDefault();
    auth.createUserWithEmailAndPassword(email, password)
    .then(authUser => {
      return authUser.user.updateProfile({
        displayName: username

      })
    })
    .catch(error =>  alert(error.message));
    setOpen(false);

  }

  const signIn = (event) => {
    event.preventDefault();
    auth.signInWithEmailAndPassword(email, password)
    .catch(error => alert(error.message));
    setOpenSignin(false);
  }

  const imageHeaderUrl = 'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
  
  
  return (
    <div className="app">
      <Modal
        open={open}
        onClose={() => setOpen(false)}>
        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src={imageHeaderUrl}
                alt=""
              />
            </center>

            <Input
              placeholder="username"
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}            
            />

            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}            
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}            
            />

            <Button type="submit" onClick={signUp}>Sign Up</Button>
          </form>
        </div>
      </Modal>
      <Modal
        open={openSignin}
        onClose={() => setOpenSignin(false)}>
        <div style={modalStyle} className={classes.paper}>

          <form className="app__signup">
            <center>
              <img 
                className="app__headerImage"
                src={imageHeaderUrl}
                alt=""
              />
            </center>
            <Input
              placeholder="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}            
            />

            <Input
              placeholder="password"
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}            
            />

            <Button type="submit" onClick={signIn}>Sign In</Button>
          </form>
        </div>
      </Modal>

      <div className="app__header">
        <img 
          className="app__headerImage"
          src={imageHeaderUrl} 
          alt="instagram"
        />
        {user ? (
          <Button onClick={() => auth.signOut()}>Log Out</Button>
        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignin(true)}>Sign In</Button>
            <Button onClick={() => setOpen(true)}>Sign Up</Button>
          </div>
        )
      }
      </div>

      <div className="app__posts">
        <div className="app__postsLeft">
          {posts.map(({id, post}) => (
              <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            ))
          }
        </div>
        <div className="app__postsRight">
          <InstagramEmbed
            url='https://www.instagram.com/p/BetlcKSlZ8b/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
          />
        </div>
        
      </div>
     
      

      {user?.displayName ? (
        <ImageUpload username={user.displayName} />
      ):(
        <center><h3>Sorry please you need to Sign Up</h3></center>
      )}
    </div>
  );
}

export default App;
