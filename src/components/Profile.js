import React from 'react';
import { AppContext } from './AppProvider';
import { getAppUser } from '../auth';

const Profile = () => {
    const context = React.useContext(AppContext);
    const user = getAppUser();

    React.useEffect(() => {
        context.setActivePage('profile');
    }, []);
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={
                {
                     width: 200, 
                     height: 200, 
                     background: `url(${user.thumbnail})`, 
                     backgroundSize: 'cover', 
                     borderRadius: '50%' 
                }
            } />
            <div>Hello <strong>{user.name}</strong></div>
            {!user.isGoogleAccount && <div>
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