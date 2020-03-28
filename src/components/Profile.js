import React from 'react';
import { AppContext } from './AppProvider';

const Profile = () => {
    const context = React.useContext(AppContext);

    React.useEffect(() => {
        context.setActivePage('profile');
    }, []);
    
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ width: 200, height: 200, background: `url(${context.user.thumbnail})`, backgroundSize: 'cover', borderRadius: '50%' }} />

            Hello <strong>{context.user.name}</strong>! We are really really glad to see your name here
        </div>
    );
};

export default Profile;