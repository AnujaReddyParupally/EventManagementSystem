import {Routes, Route, Navigate} from 'react-router-dom'
// import 'bootstrap/dist/css/bootstrap.min.css';

import Header from './components/Header/Header';
import Form from './components/Form/Form';
import './styles.css'
import Home from './components/Home/Home';
import Admin from './components/Admin/Admin';
import ReactDOM from 'react-dom';
import Spinner from './components/Spinner/Spinner';
import { useState  } from 'react';
import SessionContextProvider, { SessionConsumer } from './components/SessionCookie/SessionCookie';
import EventDetails from './components/Events/EventDetails';
import Logout from './components/Logout/Logout';
import Orders from './components/Orders/Orders';
import User from "./components/UserProfile/User";
import ProtectedRoutes from './components/HOC/ProtectedRoutes';

function App() {
  const [user, setUser] = useState({})
 
  
  return (
    <SessionContextProvider>
    {/* {!user && 
      <SessionConsumer>
        {context =>{
          setUser(context.getUser())
        }}
      </SessionConsumer>
    } */}
        <div className="App">
        <Header />

        <Routes>
          <Route path="/user" element={<User />} />
          <Route path='/admin' element={<Admin/>}/> 
          <Route path='/admin/:id' element={<Admin/>}/> 
          <Route path='/logout' element={<Logout/>}/>
          <Route path='/orders' element={<Orders/>}/> 
          <Route path='/events/details/:id'  element={<EventDetails/>}/>
          <Route path='/login' element={<Form/>}/> 
          <Route path='/events' element={<Home/>} />
          <Route path='*' element={<Navigate replace to="/events"/>}/>
        </Routes>
      </div>
     
    </SessionContextProvider>
  );
}

export default App;
