import React, { useContext, useEffect, useState } from "react";
import axios from 'axios'
import {SessionContext} from '../SessionCookie/SessionCookie'
import Notification  from "../Notifications/Notification";
const ERRORS={
    EMAIL: "Invalid User!",
    PAYMENT_FAILED: "Payment failed!",
    OTP_EXPIRED: "OTP Expired!",
    OTP_REQUIRED: "OTP is required!"
}
const ConfirmPayment = (props) => {
    const [otp, setOtp] = useState('')
    const [otpExpiry, setOtpExpiry] = useState('')
    const [email, setEmail] = useState('')
    const [userid, setUserid] = useState('')
    const [isUserVerified, setIsUserVerified] = useState(false)
    const [isOrderPlaced, setIsOrderPlaced] = useState(false)
    const [errorMessages, setErrorMessages] = useState([])
    const [notifications, setNotifications] = useState([])
    const context = useContext(SessionContext)

    useEffect(()=>{
        let user= context.getUser()
        console.log(user)
        //SEND OTP ON PAGE LOAD
        if(user){
            setEmail(user.email)
            setUserid(user.id)
            let notifications =[], errorMessages=[]
            axios.get(`/api/v1/otp/${user.email}`).then(res=>{
                console.log(res)
                if(res.status===200){
                    setOtpExpiry(res.data.expireat)
                }
                else{
                    errorMessages.push(ERRORS.EMAIL)
                    setErrorMessages(errorMessages)
                    setNotifications([])
                }
            }).catch(err=>{
                errorMessages.push(ERRORS.GENERIC_FAILED)
                setErrorMessages(errorMessages)
                setNotifications([])
            })
        }
        else{

        }
    },[])

    const sendOTP =() =>{
        let notifications =[], errorMessages=[]
        axios.get(`/api/v1/otp/${email}`).then(res=>{
            console.log(res)
            if(res.status===200){
                setOtpExpiry(res.data.expireat)
            }
            else{
                errorMessages.push(ERRORS.EMAIL)
                setErrorMessages(errorMessages)
                setNotifications([])
            }
        }).catch(err=>{
            errorMessages.push(ERRORS.GENERIC_FAILED)
            setErrorMessages(errorMessages)
            setNotifications([])
        })
    }
    const onConfirmPayment=()=>{
        let now = new Date()
        var errorMessages=[]
        if(otp.trim().length === 0)
        {
            //OTP is required
            errorMessages.push(ERRORS.OTP_REQUIRED)
            setErrorMessages(errorMessages)
            setNotifications(notifications)
            setIsUserVerified(false)
        }
        //check if OTP is expired
        else if(now < new Date(otpExpiry))
        {
            /*
                API: send otp, email to validte
                Success: User is verifed.
                         Display Booking confirmed
                Failure: display  "Payment failed!" notification 
                Error: display "Payment failed!" notification
            */ 
           
          var data = JSON.stringify({
            "email": email,
            "otp": otp
          });
           axios.post('/api/v1/otp',data, {
               headers: {
                'Content-Type': 'application/json'
               }
            }).then(res=>{
                if(res.status===200 && res.data){
                    //Success with data true or false to indicate user verification
                    setErrorMessages([])
                    setNotifications([])
                    setIsUserVerified(true)
                    placeOrder()
                }
                else{
                    //Failure
                    errorMessages.push(ERRORS.PAYMENT_FAILED)
                    setErrorMessages(errorMessages)
                    setNotifications([])
                    setIsUserVerified(false)
                }
           }).catch(err=>{
                //Error
                console.log(err)
                errorMessages.push(ERRORS.PAYMENT_FAILED)
                setErrorMessages(errorMessages)
                setNotifications([])
                setIsUserVerified(false)
           })
        }
        else{
            /* 
                OTP Expired - display error notification
            */
           errorMessages.push(ERRORS.OTP_EXPIRED)
           setErrorMessages(errorMessages)
           setNotifications([])
        }
    }
    const placeOrder = () => {
        let errorMessages=[]
         //API to create an order
         const {viptickets, gatickets, price, eventID} = props
         var data = JSON.stringify({
             "viptickets": viptickets,
             "gatickets": gatickets,
             "price": price,
             "userID": userid,
             "eventID": eventID
         })
         axios.post('/api/v1/order',data, {
             headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Bearer '+context.getToken()
             }
          }).then(res=>{
             if(res.status===200 ){
                setIsOrderPlaced(true)
                setErrorMessages([])
             }
          }).catch(err=>{
            setIsOrderPlaced(false)
            errorMessages.push(ERRORS.GENERIC_FAILED)
            setErrorMessages(errorMessages)
          })
    }
    const displayNotification = (isError) => {
        var obj = isError ? errorMessages : notifications
        return ( 
                <div className='notifications'>      
                    {obj.map((item,index)=>{
                    return  <Notification key={index} 
                                            isError={isError}
                                            id={index}
                                            message={item}
                                            onClose={onCloseNotification}/>
                    })}
                </div> 
            )

    }
    const onCloseNotification = (id, isError) => {
        if(isError){
            let errors =errorMessages.filter((err,index)=> index!==id)
            setErrorMessages(errors)
        }
        else{
            let notify = notifications.filter((notification,index)=> index!==id)
            setNotifications(notify)
        }
    }
    return (
        <>
        {errorMessages.length ? displayNotification(true) :""}
        {notifications.length ? displayNotification(false) :""} 
       
        <div className="confirm-payment">
            {isUserVerified  && isOrderPlaced
              ? <>
                <img src={window.location.origin+"/assets/images/success.png"}/>
                <p>Payment Successful!</p>
                <p>Tickets will be sent to your registered email ID.</p>
                <button type="button" className="btn-book-ticket" onClick={props.onCancelPayment}>Continue Booking</button>
              </>
              : <>
                    <p>OTP has been shared to your registered email ID.</p>
                    <div className="otp">
                        <input type="text" onBlur={event=>setOtp(event.target.value)}></input>
                    </div>
                    <span className='resend-otp' onClick={sendOTP}>Resend OTP</span>
                    <div style={{display:"flex"}}>
                        <button type="button" className="btn-book-ticket" onClick={onConfirmPayment}>Confirm Payment</button>
                        <button type="button" className="btn-book-cancel" onClick={props.onCancelPayment}>Cancel</button>
                    </div>
                </>}
        </div>
        </>
        )
}

export default ConfirmPayment