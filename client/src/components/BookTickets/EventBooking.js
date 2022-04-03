import React, { Component } from "react";
import Notification from '../Notifications/Notification'
import BookingForm from "./BookingForm";
import ConfirmPayment from "./ConfirmPayment";
import PaymentSummary from "./PaymentSummary";

const TICKET_TYPE={VIP:'VIP', GA:'GA'}
const ERRORS = {
    INVALID_DATE: "Date is required!"
    ,INVALID_TIME: "Time is required!"
    ,INVALID_TICKETS: "Book at least 1 ticket to proceed!"
    ,MAX_LIMIT_EXCEEDED: "Maximum booking limit exceeded!"
}

class EventBooking extends Component{
    constructor(){
        super()
        this.state={
                date: '',
                time:'',
                viptickets:0,
                gatickets: 0,
                price: 0,
                errorMessages:[],
                notifications:[],
                showbill: false,
                proceedToPayment: false
        }
        this.getAvailableTickets = this.getAvailableTickets.bind(this)
        this.onFormSubmit = this.onFormSubmit.bind(this)
        this.displayNotification = this.displayNotification.bind(this)
        this.onCloseNotification = this.onCloseNotification.bind(this)
        this.onEventDateChange = this.onEventDateChange.bind(this)
        this.onStartsAtChange = this.onStartsAtChange.bind(this)
        this.onVipTicketsChange = this.onVipTicketsChange.bind(this)
        this.onGaTicketsChange = this.onGaTicketsChange.bind(this)
        this.onProceedToPay = this.onProceedToPay.bind(this)
        this.onCancelPayment = this.onCancelPayment.bind(this)
    }
    getAvailableTickets(type){
        let value=0
        let {date, time} = this.state
        if(date && time){
            let selectedslot = this.props.slots.find(s=> s.date === date && s.starttime === time)
            if(type === TICKET_TYPE.VIP)
                value= selectedslot.availVIPTick
            else if(type === TICKET_TYPE.GA)
                value= selectedslot.availGATick
            else
                value = 0
        }
        return value

    }
    onCancelPayment(){
        this.setState({...this.state,proceedToPayment:false,showbill:false, errorMessages:[]})
    }
    onProceedToPay(billamount){
        this.setState({...this.state,price: billamount, proceedToPayment:true,showbill:false, errorMessages:[]})
    }
    onPlaceOrder(){
        return {

        }
    }
    onEventDateChange(event){
        this.setState({date: event.target.value, time:'', viptickets: 0, gatickets: 0, errorMessages:[]})
    }
    onStartsAtChange(event){
        this.setState({...this.state, time:event.target.value, viptickets: 0, gatickets: 0})
    }
    onVipTicketsChange(event){
        this.setState({...this.state, viptickets:event.target.value})
    }
    onGaTicketsChange(event){
        this.setState({...this.state, gatickets:event.target.value})
    }
    onFormSubmit(event){
        event.preventDefault()
        let {date, time, viptickets, gatickets} = this.state
        let errorMessages = []
        if(!date.trim()) errorMessages.push(ERRORS.INVALID_DATE)
        if(!time.trim()) errorMessages.push(ERRORS.INVALID_TIME)
        if(!viptickets && !gatickets) errorMessages.push(ERRORS.INVALID_TICKETS)
        else{
            let vip = +viptickets, ga = +gatickets
            console.log(vip+ga)
            if(vip+ga > this.props.maxTickets)
            errorMessages.push(ERRORS.MAX_LIMIT_EXCEEDED)
        }
        if(errorMessages.length === 0){
            //SHOW TOTAL BILL
            this.setState({...this.state, showbill: true, proceedToPayment: false, errorMessages:[]})
        }
        else{
            //STAY IN THE SAME PAGE
            this.setState({...this.state, errorMessages, notifications:[]})
        }
    }
    displayNotification(isError){
        let {errorMessages, notifications}= this.state
        var obj = isError ? errorMessages : notifications
        return ( 
                <div className='notifications'>      
                    {obj.map((item,index)=>{
                    return  <Notification key={index} 
                                            isError={isError}
                                            id={index}
                                            message={item}
                                            onClose={this.onCloseNotification}/>
                    })}
                </div> 
            )

    }
    onCloseNotification(id, isError){
        var {errorMessages, notifications} = this.state
        if(isError){
            errorMessages =errorMessages.filter((err,index)=> index!==id)
            this.setState({...this.state, errorMessages})
        }
        else{
            notifications = notifications.filter((notification,index)=> index!==id)
            this.setState({...this.state, notifications})
        }
    }
    render(){
        let {slots, vipprice, gaprice, eventID} = this.props
        console.log(slots)
        let {date, time, errorMessages, notifications, showbill, proceedToPayment, viptickets, gatickets, price} = this.state
        let vip = date && time ? this.getAvailableTickets(TICKET_TYPE.VIP) : 0 
        let ga = date && time ? this.getAvailableTickets(TICKET_TYPE.GA) : 0 
        console.log(slots)
        return(
            <>
            {errorMessages.length ? this.displayNotification(true) :""}
            {notifications.length ? this.displayNotification(false) :""} 

            { proceedToPayment 
              ? <ConfirmPayment viptickets={viptickets} gatickets={gatickets} eventID={eventID} price={price}
                                onCancelPayment={this.onCancelPayment}/>
              : (showbill 
                    ? <PaymentSummary date={date} time={time} 
                                        vip={viptickets} ga={gatickets} 
                                        vipprice={vipprice} gaprice={gaprice}
                                        onProceedToPay={this.onProceedToPay}
                                        onCancelPayment={this.onCancelPayment}/>
                    : <BookingForm slots={slots} vip={vip} ga={ga} date={date}
                                    onFormSubmit={this.onFormSubmit}
                                    onEventDateChange={this.onEventDateChange}
                                    onStartsAtChange={this.onStartsAtChange}
                                    onVipTicketsChange={this.onVipTicketsChange}
                                    onGaTicketsChange={this.onGaTicketsChange}
                                    onCancelPayment={this.onCancelPayment}/>)
            } 
            </>
        )
    }
}

export default EventBooking