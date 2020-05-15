import React from 'react';
import { Redirect } from 'react-router-dom';
import StyledForm, { StyledFormWrapper } from './StyledForm';

import { endpointUrl } from '../helpers';

const Register = () => {
    const [state, setState] = React.useState({
        completed: false,
        email: '',
        password: '',
        confirmPassword: '',
        name: ''
    });

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value
        })
    }

    const register = async (e) => {
        e.preventDefault();

        if (state.password !== state.confirmPassword) {
            alert('passwords dont match');
            return;
        }

        let response;

        try {
            response = await fetch(`${endpointUrl}/users/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: state.email,
                    name: state.name,
                    password: state.password,
                })
            });
        } catch (err) {
            console.log(err);
        }

        if (response.status === 200) {
            setState({
                ...state,
                completed: true
            })
        } else {
            const error = await response.text();
            alert(error);
        }

    }

    if (state.completed) {
        return <Redirect to={{
            pathname: '/login',
            message: `Well done ${state.name}`
        }} />
    }
    return (
        <StyledFormWrapper>
            <StyledForm>
                <h1>Register</h1>
                <label>Email Address</label>
                <input type="email" value={state.email} onChange={(event) => handleInputChange('email', event)} />
                <label>Name</label>
                <input type="text" value={state.name} onChange={(event) => handleInputChange('name', event)} />
                <label>Password</label>
                <input type="password" value={state.password} onChange={(event) => handleInputChange('password', event)} />
                <label>Confirm Password</label>
                <input type="password" value={state.confirmPassword} onChange={(event) => handleInputChange('confirmPassword', event)} />
                <button onClick={(e) => register(e)}>Register</button>
            </StyledForm>
        </StyledFormWrapper>
    );
};

export default Register;