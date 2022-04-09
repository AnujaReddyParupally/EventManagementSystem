import React from 'react'

const PaymentSummary = (props) => {
    let {date, time, vip, ga, vipprice, gaprice, onProceedToPay, onCancelPayment} = props
    const getTotalBill = () => {
        return (vip*vipprice) + (ga*gaprice)
    }
    return (
        <div className='payment-summary'>
            <h6>Payment Summary:</h6>
            <div className='body'>
            <table>
                <tbody>
                    <tr>
                        <td>Event date:</td>
                        <td>{date}</td>
                    </tr>
                    <tr>
                        <td>Start time:</td>
                        <td>{time}</td>
                    </tr>
                    <tr>
                        <td>VIP tickets:</td>
                        <td>{vip}</td>
                    </tr>
                    <tr>
                        <td>GA tickets:</td>
                        <td>{ga}</td>
                    </tr>
                    
                </tbody>
            </table>
            <div className='amount'>
                <span><b>Total Amount</b></span>
                <div style={{display: "flex", justifyContent: "flex-end", alignItems: "flex-end"}}>
                    <b>INR &nbsp;</b>
                    <div style={{font:" 400 45px 'Open Sans', sans-serif" ,marginTop: "0px"}}>{getTotalBill()}</div>
                </div>
            </div>
            </div>
            <div style={{display:"flex"}}>
                <button type="button" className="btn-book-ticket" onClick={onProceedToPay}>Proceed to pay</button>
                <button type="button" className="btn-book-cancel" onClick={onCancelPayment}>Cancel</button>
            </div>
        </div>
    )
}

export default PaymentSummary