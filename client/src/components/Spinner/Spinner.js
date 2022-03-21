import React from "react";

const Spinner = (props) => {
    return (
        <>
        {props.show 
            ? <div className='spinner'>
                    <div className="spinner-img">
                    <img src='assets/images/loader.gif' height={50}></img>
                    </div>
             </div>
            : ''
        }
        </>
    )
}

export default Spinner