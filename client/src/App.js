import React from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import './styles.css'
import SessionContextProvider from './components/SessionCookie/SessionCookie';

import Spinner from './components/Spinner/Spinner';
const Header = React.lazy(()=> import("./components/Header/Header"));
const Home = React.lazy(()=> import("./components/Home/Home"));
const User = React.lazy(()=> import("./components/UserProfile/User"));
const Admin = React.lazy(()=> import("./components/Admin/Admin"));
const Form = React.lazy(()=> import("./components/Form/Form"));
const Orders = React.lazy(()=> import('./components/Orders/Orders'));
const Logout = React.lazy(()=> import('./components/Logout/Logout'));
const EventDetails = React.lazy(()=> import('./components/Events/EventDetails'));

function App() {
  return (
    <SessionContextProvider>
        <div className="App">
       
        <React.Suspense fallback={<Spinner isLoading={true}/>}>
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
        </React.Suspense>
      </div>
     
    </SessionContextProvider>
  );
}

export default App;
