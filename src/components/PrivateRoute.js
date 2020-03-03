import React from 'react';
import { AppContext } from './AppProvider';
import { Route, Redirect } from 'react-router-dom';

const PrivateRoute = ({ component: Component, ...rest }) => {
    const context = React.useContext(AppContext);

    return (
        <Route render={(props) => {  
            return context.userStatus === 'logged-in' || rest.location.userStatus === 'logged-in'
                ? <Component {...props} />
                : <Redirect to='/login' />
        }
        } />
    )
}

export default PrivateRoute;