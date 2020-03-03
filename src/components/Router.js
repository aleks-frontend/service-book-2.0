import React, { useContext } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { AppProvider } from './AppProvider';
import Home from './Home';
import PrivateRoute from './PrivateRoute';
import History from './History';
import Login from './Login';
import NotFound from './NotFound';
import Register from './Register';
import ResetPassword from './ResetPassword';
import ForgotPassword from './ForgotPassword';

const Router = () => {
    return (
        <AppProvider>
            <BrowserRouter>
                <Switch>
                    <PrivateRoute exact path='/' component={Home} />
                    <PrivateRoute path='/history' component={History} />
                    <Route path='/register' component={Register} />
                    <Route path='/reset-password/:userId/:token' component={ResetPassword} />
                    <Route path='/forgot-password' component={ForgotPassword} />
                    <Route path="/login" component={Login} />
                    <Route exact path="/:userId/:token" render={(props) => <Home {...props} />} />
                    <Route component={NotFound} />
                </Switch>
            </BrowserRouter>
        </AppProvider>
    )
}

export default Router;