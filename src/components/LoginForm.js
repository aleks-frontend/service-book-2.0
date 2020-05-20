import React from 'react';
import StyledForm from './StyledForm';

const LoginForm = (props) => {
    
    const [ state, setState ] = React.useState({
        email: '',
        password: ''
    });

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value 
        })
    }
    
    return (
        <StyledForm onSubmit={(e) => {
            e.preventDefault(); 
            props.onSubmit(state.email, state.password);
        }}>
            <label>Email Address</label>
            <input type="email" value={state.email} onChange={(event) => handleInputChange('email', event)} />
            <label>Password</label>
            <input type="password" value={state.password} onChange={(event) => handleInputChange('password', event)} />
            <button type="submit">Log In</button>
        </StyledForm>
    );
    
};

export default LoginForm;
