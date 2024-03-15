
import Home from "./pages/Home";
import {Route, Routes} from 'react-router-dom';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PostDetails from "./pages/PostDetails";
import CreatePost from "./pages/CreatePost";
import EditPost from "./pages/EditPost";
import {  UserContextProvider } from './context/UserContext'
import Profile from "./pages/Profile";
import MyBlogs from "./pages/MyBlogs";


const App = () => {
  return (
   
    <UserContextProvider>
      
      <Routes>
        <Route exact path="/" element={<Home/>}/>
        <Route exact path="/login" element={<Login/>}/>
        <Route exact path="/signup" element={<Signup/>}/>
        <Route exact path="/write" element={<CreatePost/>}/>
        <Route exact path="/posts/post/:id" element={<PostDetails/>}/>
        <Route exact path="/edit/:id" element={<EditPost/>}/>
        <Route exact path="/myblogs/:id" element={<MyBlogs/>}/>
        <Route exact path="/profile/:id" element={<Profile/>}/>
      </Routes>
      
   </UserContextProvider>
  )
}

export default App