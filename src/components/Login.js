import React from 'react';
import styled from 'styled-components';
import LoginForm from './LoginForm';
import LoadingSpinner from './UI/LoadingSpinner';
import { endpointUrl, colors } from '../helpers';

import { appLogin } from '../auth';
import fetchApi from '../fetchApi';

const LoginWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`;

const LoginBox = styled.div`
    padding: 2rem 3rem;
    width: 500px;
    max-width: 100%;
    color: ${colors.rddarkgray};
    text-align: center;
    box-sizing: border-box;
`;

const LoginLogo = styled.img`
    margin-bottom: 2rem;
    width: 10rem;
`;

const LoginMessage = styled.div`
    margin: 0 0 2rem;
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
    color: ${colors.rddarkgray};
    background-color: #fff;
    text-decoration: none;
    border: 1px solid ${colors.rdlightgray};

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
    color: ${colors.rdlightgray};

    &::before, &::after {
        content: '';
        display: block;
        margin: 0 5%;
        height: 1px;
        width: 30%;
        background: ${colors.rdlightgray};
    }
`;

const LoginFooter = styled.div`
    margin: 2rem 0 0;

    a {
        color: ${colors.rdblue};
        text-decoration: none;
        &:hover { cursor: pointer; }
        &:visited { color: ${colors.rdblue}; }
    }
`;


const Login = (props) => {    
    const [state, setState] = React.useState({
        isGoogleCallback: false,
        autoLoginRejected: false
    })

    React.useEffect(() => {
        const isGoogleCallback = props.match && props.match.params && props.match.params.googleToken;
        if (isGoogleCallback) {
            setState({
                ...state,
                isGoogleCallback: true
            });
            const googleToken = props.match.params.googleToken;
            googleLoginSubmit(googleToken);
        } else {
            tryAutoLogin();
        }
    }, []);

    const gotToRegister = (e) => {
        e.preventDefault();
        props.history.push('/register');
    }

    const goToForgotPassword = (e) => {
        e.preventDefault();
        props.history.push('/forgot-password');
    }

    const tryAutoLogin = async () => {        
        const response = await fetchApi({ 
            url: '/auth',
            method: 'POST'
        });

        if (response && response.status === 200 && response.data.token && response.data.user) {
            appLogin({ 
                history: props.history, 
                token: response.data.token, 
                user: response.data.user 
            });
        } else {
            setState({
                ...state,
                autoLoginRejected: true
            });
        }
    }

    const classicLoginSubmit = async (email, password) => {
        const response = await fetchApi({ 
            url: '/auth',
            method: 'POST',
            body: {
                email,
                password
            }
        });

        if ( response.status === 200 ) {            
            const { token, user } = response.data;            
            
            appLogin({ history: props.history, token, user });
        } else {
            const error = response.data;
            alert(error);
        }
    }

    const googleLoginSubmit = async (googleToken) => {
        const response = await fetchApi({ 
            url: '/auth/validate',
            method: 'GET',
            token: googleToken            
        });

        if ( response.status === 200 ) {            
            const { token, user } = response.data;
                        
            appLogin({ history: props.history, token, user });
        } else {
            const error = response.data;
            alert(error);
        }
    }

    

    return (
        <React.Fragment>
            {(state.autoLoginRejected || state.isGoogleCallback) && <LoginWrapper>
                <LoginBox>
                    <LoginLogo src="/img/login-logo.svg" />
                    <LoginMessage>{props.location.message}</LoginMessage>
                    {/* <LoginHeading>Log in</LoginHeading> */}
                    <LoginGoogleButton href={`${endpointUrl}/auth/google`}>
                        Use Google Account
                    </LoginGoogleButton>
                    <LoginSeparator>or</LoginSeparator>
                    <LoginForm onSubmit={classicLoginSubmit}/>
                    <LoginFooter>
                        <a href="#" onClick={(e) => goToForgotPassword(e)} className="forgotPassword">Forgot Password</a>
                        <p>Don't have an account? <a href="#" onClick={(e) => gotToRegister(e)} className="signUp">Sign Up</a></p>
                    </LoginFooter>
                </LoginBox>
            </LoginWrapper>}
            {!state.autoLoginRejected && <LoadingSpinner />}
        </React.Fragment>
    );
};

export default Login;