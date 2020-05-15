import React from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import { endpointUrl, colors } from '../helpers';

import { appLogin } from '../auth';

const colors2 = {
    silver: '#C4C4C4',
    cornflowerBlue: '#7972FC'
}

const LoginWrapper = styled.div`
    padding: 20px 100px;
    width: 500px;
    max-width: 100%;
    background: #e3e3e3;
    text-align: center;
    box-sizing: border-box;
`;

const LoginHeading = styled.div`
    margin-bottom: 20px;
    font-size: 30px;
    font-weight: bold;
`;

const LoginGoogleButton = styled.a`
    position: relative;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    width: 100%;
    color: #000;
    background-color: #fff;
    text-decoration: none;

    &::before {
        content: '';
        position: absolute;
        left: 20px;
        top: 50%;
        transform: translateY(-50%);
        width: 20px;
        height: 20px;
        background: url('https://images.theconversation.com/files/93616/original/image-20150902-6700-t2axrz.jpg?ixlib=rb-1.1.0&q=45&auto=format&w=1000&fit=clip');
        background-size: 100% 100%;
    }
`;

const LoginSeparator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: ${colors2.silver};

    &::before, &::after {
        content: '';
        display: block;
        margin: 0 5%;
        height: 1px;
        width: 30%;
        background: ${colors2.silver};
    }
`;

const LoginFooter = styled.div`
    a {
        &:hover { cursor: pointer; }
    }
`;


const Login = (props) => {

    const gotToRegister = (e) => {
        e.preventDefault();
        props.history.push('/register');
    }

    const goToForgotPassword = (e) => {
        e.preventDefault();
        props.history.push('/forgot-password');
    }

    const classicLoginSubmit = async (email, password) => {
        const response = await fetch(`${endpointUrl}/auth/`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        });

        if ( response.status === 200 ) {            
            const { token, user } = await response.json();            
            
            appLogin({ history: props.history, token, user });
        } else {
            const error = await response.text();
            alert(error);
        }
    }

    const googleLoginSubmit = async (googleToken) => {
        const response = await fetch(`${endpointUrl}/auth/validate`, {
            method: 'GET',
            credentials: 'include',
            headers: {
                'x-auth-token': googleToken,
            }            
        });

        if ( response.status === 200 ) {            
            const { token, user } = await response.json();
                        
            appLogin({ history: props.history, token, user });
        } else {
            const error = await response.text();
            alert(error);
        }
    }

    const isGoogleCallback = props.match && props.match.params && props.match.params.googleToken;
    if (isGoogleCallback) {
        const googleToken = props.match.params.googleToken;
        googleLoginSubmit(googleToken);
    }

    return (
        <LoginWrapper>
            <div>{props.location.message}</div>
            <LoginHeading>Log in</LoginHeading>
            <LoginGoogleButton href={`${endpointUrl}/auth/google`}>
                Use Google Account
            </LoginGoogleButton>
            <LoginSeparator>or</LoginSeparator>
            <LoginForm onSubmit={classicLoginSubmit}/>
            <LoginFooter>
                <a href="#" onClick={(e) => goToForgotPassword(e)} className="forgotPassword">Forgot Password</a>
                <p>Don't have an account? <a href="#" onClick={(e) => gotToRegister(e)} className="signUp">Sign Up</a></p>
            </LoginFooter>
        </LoginWrapper>
    );
};

export default Login;