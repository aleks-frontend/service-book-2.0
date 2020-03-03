import React from 'react';

// make a context
const AppContext = React.createContext();


const AppProvider = (props) => {
    const [state, setState] = React.useState({
        userStatus: 'logged-out',
        token: '',
        user: {}
    });

    const setUserInfo = ({userStatus, token, user}) => {
        const stateCopy = { ...state };

        if ( userStatus !== undefined ) stateCopy['userStatus'] = userStatus;
        if ( token !== undefined ) stateCopy['token'] = token;
        if ( user !== undefined ) stateCopy['user'] = user;
        
        setState(stateCopy);
    }

    return (
        <AppContext.Provider value={{
            userStatus: state.userStatus,
            token: state.token,
            user: state.user,
            setUserInfo: setUserInfo
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider };