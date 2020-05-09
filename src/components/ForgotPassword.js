import React from 'react';
import styled from 'styled-components';

import StyledForm, { StyledFormWrapper } from './StyledForm';
import { Redirect } from 'react-router-dom';

import forgotPasswordAPI from '../API/forgotPassword';

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

        const message = await forgotPasswordAPI(state.email);
        alert(message);
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