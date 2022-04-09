import React from 'react';
import {useParams, useNavigate} from 'react-router-dom';

function WithRouter(Component) {
    function ComponentWithRouter(props) {
      let params = useParams()
      let navigate = useNavigate()
      return <Component {...props} params={params} navigate={navigate} />
    }
    return ComponentWithRouter
}


export default WithRouter