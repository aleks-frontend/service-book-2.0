import React from 'react';
import { AppContext } from './AppProvider';
import { Route, Redirect } from 'react-router-dom';
import { getAppToken } from '../auth';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const context = React.useContext(AppContext);
    
    return (
        <Route render={(props) => {  
            return getAppToken() !== null
                ? <Component {...props} {...rest} />
                : <Redirect to='/login' />
        }
        } />
    )
}

export default PrivateRoute;