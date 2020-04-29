import React from 'react';

// make a context
const AppContext = React.createContext();
const AppProvider = (props) => {
    const defaultFilters = {
        status: [],
        searchText: '',
        sortDirection: 'desc',
        sortCriteria: 'date'
    };

    const [state, setState] = React.useState({
        userStatus: 'logged-out',
        token: '',
        user: {},
        activePage: 'home',
        snackbarVisible: false,
        snackbarEntity: '',
        snackbarAction: '',
        statusActiveFilters: [],
        filters: defaultFilters
    });

    const setUserInfo = ({ userStatus, token, user }) => {
        const stateCopy = { ...state };

        if (userStatus !== undefined) stateCopy['userStatus'] = userStatus;
        if (token !== undefined) stateCopy['token'] = token;
        if (user !== undefined) {
            if (user && !user.thumbnail) {
                user.thumbnail = 'https://www.computerhope.com/jargon/g/geek.jpg';
            }

            stateCopy['user'] = user;
        }

        setState(stateCopy);
    }

    const setActivePage = (key) => {
        setState({
            ...state,
            activePage: key
        })
    }

    // Snackbar control methods
    const hideSnackbar = (reason) => {
        if (reason === 'clickaway') return;
        setState({ ...state, snackbarVisible: false });
    };

    const showSnackbar = (message) => {
        setState({
            ...state,
            snackbarVisible: true,
            snackbarMessage: message
        });
    }

    const setFilters = (filters = {}, resetRest = false) => {
        let mergedFilters = resetRest ? { ...defaultFilters, ...filters } : { ...state.filters, ...filters };

        setState({ ...state, filters: mergedFilters });
        return mergedFilters;
    }

    return (
        <AppContext.Provider value={{
            userStatus: state.userStatus,
            token: state.token,
            user: state.user,
            setUserInfo,
            activePage: state.activePage,
            setActivePage,
            snackbarVisible: state.snackbarVisible,
            snackbarMessage: state.snackbarMessage,
            showSnackbar,
            hideSnackbar,
            filters: state.filters,
            setFilters,
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider };