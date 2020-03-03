import React from 'react';
import { Redirect } from 'react-router-dom';
import StyledForm from './StyledForm';

const Register = () => {
    const [ state, setState ] = React.useState({
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

    const register = async () => {
        if ( state.password !== state.confirmPassword ) {
            alert('passwords dont match');
            return;
        }
        
        const response = await fetch('https://radiant-crag-38285.herokuapp.com/users/', {
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

        if ( response.status === 200 ) {
            setState({
                ...state,
                completed: true
            })
        } else {
            const error = await response.text();
            alert(error);
        }
        
    }
    
    if ( state.completed ) {
        return <Redirect to={{
            pathname: '/login',
            message: `Well done ${state.name}`
        }} />
    }
    return (        
        <StyledForm>
            <label>Email Address</label>
            <input type="email" value={state.email} onChange={(event) => handleInputChange('email', event)} />
            <label>Name</label>
            <input type="text" value={state.name} onChange={(event) => handleInputChange('name', event)} />
            <label>Password</label>
            <input type="password" value={state.password} onChange={(event) => handleInputChange('password', event)} />
            <label>Confirm Password</label>
            <input type="password" value={state.confirmPassword} onChange={(event) => handleInputChange('confirmPassword', event)} />
            <button type="submit" onClick={register}>Register</button>
        </StyledForm>
    );
};

export default Register;