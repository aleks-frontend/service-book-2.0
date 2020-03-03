import React from 'react';
import { Redirect } from 'react-router-dom';
import StyledForm from './StyledForm';

const ResetPassword = (props) => {
    const [ state, setState ] = React.useState({
        password: '',
        confirmPassword: '',
        isFinished: false
    });

    const { userId, token } = props.match.params;

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value 
        })
    }

    const resetPassword = async (e) => {
        e.preventDefault();
        if ( state.password !== state.confirmPassword ) {
            alert('Your passwords are not matching. Please try again.')
            return;
        }

        const response = await fetch('https://radiant-crag-38285.herokuapp.com/users/resetpass', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': token
            },
            body: JSON.stringify({
                password: state.password
            })
        });
        
        if ( response.status === 200 ) {
            setState({
                ...state, 
                isFinished: true
            })
        } else {
            const message = await response.text();
            alert(message);
        }
    }    

    if ( state.isFinished ) {
        return <Redirect to={{
            pathname: '/login',
            message: `Your password was successfully reset.`
        }} />
    } else {
        return (        
            <StyledForm onSubmit={(e) => resetPassword(e)}>
                <label>Password</label>
                <input type="password" value={state.password} onChange={(event) => handleInputChange('password', event)} />
                <label>Confirm Password</label>
                <input type="password" value={state.confirmPassword} onChange={(event) => handleInputChange('confirmPassword', event)} />
                <button type="submit">Reset Password</button>
            </StyledForm>
        );
    }
};

export default ResetPassword;