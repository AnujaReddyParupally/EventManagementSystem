import React from "react";
import ReactDOM from 'react-dom'

import styles from './Spinner.module.css'

const Spinner = (props) => {
    return (
        <>
        {props.show 
            ? ReactDOM.createPortal( 
                <div className={styles.spinner}>
                    <div className={styles.spinner_img}>
                            <img src={window.location.origin + '/assets/images/loader.gif'} height={50}></img>
                    </div>
                </div>
             ,document.getElementById('spinner-root'))
            : ''
        }
        </>
    )
}

export default Spinner