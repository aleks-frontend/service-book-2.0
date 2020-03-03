import React from 'react';
import StyledForm from './StyledForm';

const ForgotPassword = () => {
    const [ state, setState ] = React.useState({
        email: ''
    });

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value 
        })
    }

    const requestPassword = async (e) => {
        e.preventDefault();

        const response = await fetch('https://radiant-crag-38285.herokuapp.com/users/forgotpass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: state.email
            })
        });

        const message = await response.text();
        alert(message);
    }

    return (        
        <StyledForm onSubmit={(e) => requestPassword(e)}>
            <label>Email Address</label>
            <input type="email" value={state.email} onChange={(event) => handleInputChange('email', event)} />
            <button type="submit">Send Request</button>
        </StyledForm>
    );
};

export default ForgotPassword;