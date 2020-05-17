import React from 'react';

import StyledForm, { StyledFormWrapper } from './StyledForm';
import { Redirect } from 'react-router-dom';

import fetchApi from '../fetchApi';

const ForgotPassword = () => {
    const [state, setState] = React.useState({
        email: '',
        redirect: false
    });

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value
        })
    }

    const requestPassword = async (e) => {
        e.preventDefault();
        
        await fetchApi({ 
            url: '/users/forgotpassword',
            method: 'POST',
            body: {
                email: state.email
            }
        });
        
        setState({ ...state, redirect: true });
    }

    return (
        <React.Fragment>
            {state.redirect && <Redirect to={{
                pathname: '/login',
                message: "Reset link was sent to your email address."
            }} />}
            <StyledFormWrapper>
                <StyledForm onSubmit={(e) => requestPassword(e)}>
                    <h1>Forgot Password</h1>
                    <label>Email Address</label>
                    <input type="email" value={state.email} onChange={(event) => handleInputChange('email', event)} />
                    <button type="submit">Send Request</button>
                </StyledForm>
            </StyledFormWrapper>
        </React.Fragment>
    );
};

export default ForgotPassword;