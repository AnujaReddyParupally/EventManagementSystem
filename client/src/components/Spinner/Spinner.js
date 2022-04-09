import React from "react";
import ReactDOM from 'react-dom'

const Spinner = (props) => {
    return (
        <>
        {props.show 
            ? ReactDOM.createPortal( 
                <div className='spinner'>
                    <div className="spinner-img">
                        <img src='assets/images/loader.gif' height={50}></img>
                    </div>
                </div>
             ,document.getElementById('spinner-root'))
            : ''
        }
        </>
    )
}

export default Spinner