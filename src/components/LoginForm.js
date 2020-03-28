import React from 'react';
import StyledForm from './StyledForm';
import { AppContext } from './AppProvider';
import { Redirect } from 'react-router-dom';

const LoginForm = () => {
    const context = React.useContext(AppContext);
    const [ state, setState ] = React.useState({
        completed: false,
        email: '',
        password: ''
    });

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value 
        })
    }

    const login = async (e) => {
        e.preventDefault();
        const response = await fetch('https://radiant-crag-38285.herokuapp.com/auth/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: state.email,
                password: state.password,
            })
        });

        if ( response.status === 200 ) {
            const { token, user } = await response.json();

            context.setUserInfo({userStatus: 'logged-in', token, user});
            
            setState({
                ...state,
                completed: true
            });
        } else {
            const error = await response.text();
            alert(error);
        }
    }
    
    if ( context.userStatus === 'logged-in' ) {        
        return <Redirect to='/' />
    } else {        
        return (
            <StyledForm onSubmit={(e) => login(e)}>
                <label>Email Address</label>
                <input type="email" value={state.email} onChange={(event) => handleInputChange('email', event)} />
                <label>Password</label>
                <input type="password" value={state.password} onChange={(event) => handleInputChange('password', event)} />
                <button type="submit">Log In</button>
            </StyledForm>
        );
    }
    
};

export default LoginForm;
