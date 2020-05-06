import React from 'react';
import { AppContext } from './AppProvider';

const Profile = () => {
    const context = React.useContext(AppContext);

    React.useEffect(() => {
        context.setActivePage('profile');
    }, []);
    
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
            {!context.user.googleId && <div>
                <h1>Change Password</h1>  
                <div>
                    <label>Current Password</label> 
                    <input type="password" />
                </div>
                <div>
                    <label>New Password</label> 
                    <input type="password" />
                </div>
                <div>
                    <label>Confirm Password</label> 
                    <input type="password" />
                </div>
                <button>Submit</button>
            </div>}            
        </div>
    );
};

export default Profile;