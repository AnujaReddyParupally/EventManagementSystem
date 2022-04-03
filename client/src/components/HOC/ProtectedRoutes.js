import { Outlet, Navigate, useLocation } from "react-router-dom";
import { SessionContext } from "../SessionCookie/SessionCookie";
import { useContext } from "react";

// const ProtectedRoutes = (props) => {
//     const context = useContext(SessionContext)
//     const loggedinuser = context.getUser()
//     return loggedinuser ? <Outlet/> : <Navigate to="/login" replace={true}/>
// }

const ProtectedRoutes = () => {
    const context = useContext(SessionContext)
    const loggedinuser = context.getUser()
    const location = useLocation()
    return loggedinuser?._id
           ? (loggedinuser.role ? <Outlet/> 
                                : <Navigate to="/events" replace={true} state={{from : location}}/> )  //Not authorized
           : <Navigate to="/login" replace={true}  state={{from : location}}/> 
}

export default ProtectedRoutes