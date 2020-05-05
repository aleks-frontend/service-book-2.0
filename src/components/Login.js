import React from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import { endpointUrl } from '../helpers';

const colors = {
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
        background: red;
    }
`;

const LoginSeparator = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    color: ${colors.silver};

    &::before, &::after {
        content: '';
        display: block;
        margin: 0 5%;
        height: 1px;
        width: 30%;
        background: ${colors.silver};
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

    return (
        <LoginWrapper>
            <div>{props.location.message}</div>
            <LoginHeading>Log in</LoginHeading>
            <LoginGoogleButton href={`${endpointUrl}/auth/google`}>
                Use Google Account
            </LoginGoogleButton>
            <LoginSeparator>or</LoginSeparator>
            <LoginForm />
            <LoginFooter>
                <a href="#" onClick={(e) => goToForgotPassword(e)} className="forgotPassword">Forgot Password</a>
                <p>Don't have an account? <a href="#" onClick={(e) => gotToRegister(e)} className="signUp">Sign Up</a></p>
            </LoginFooter>
        </LoginWrapper>
    );
};

export default Login;