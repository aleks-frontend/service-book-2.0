import React from 'react';
import { AppContext } from './AppProvider';

import resetPasswordAPI from '../API/resetPassword';

const Profile = () => {
    const context = React.useContext(AppContext);

    const [state, setState] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmedPassword: ''
    });

    React.useEffect(() => {
        context.setActivePage('profile');
    }, []);

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value
        })
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();

        const { currentPassword, newPassword: password, confirmedPassword } = state;

        if (password !== confirmedPassword) {
            alert('Confirmed password does not match the new password');
            return;
        }

        const message = await resetPasswordAPI({
            token: context.token,
            currentPassword,
            password
        });

        context.showSnackbar(message);
        setState({
            ...state,
            currentPassword: '',
            newPassword: '',
            confirmedPassword: ''
        })
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={
                {
                    width: 200,
                    height: 200,
                    background: `url(${context.user.thumbnail})`,
                    backgroundSize: 'cover',
                    borderRadius: '50%'
                }
            } />
            <div>Hello <strong>{context.user.name}</strong></div>
            {!context.user.googleId && <form onSubmit={(e) => handleFormSubmit(e)}>
                <h1>Change Password</h1>
                <div>
                    <label>Current Password</label>
                    <input
                        type="password"
                        value={state.currentPassword}
                        onChange={(event) => handleInputChange('currentPassword', event)}
                    />
                </div>
                <div>
                    <label>New Password</label>
                    <input
                        type="password"
                        value={state.newPassword}
                        onChange={(event) => handleInputChange('newPassword', event)}
                    />
                </div>
                <div>
                    <label>Confirm Password</label>
                    <input
                        type="password"
                        value={state.confirmedPassword}
                        onChange={(event) => handleInputChange('confirmedPassword', event)}
                    />
                </div>
                <button>Submit</button>
            </form>}
        </div>
    );
};

export default Profile;