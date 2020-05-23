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
        activePage: 'home',
        snackbarVisible: false,
        snackbarEntity: '',
        snackbarAction: '',
        statusActiveFilters: [],
        deletePrompt: {
            id: null,
            visibility: false,
            callback: null
        },
        filters: defaultFilters
    });

    const hideDeletePrompt = (snackbarMessage) => {
        setState({
            ...state,
            deletePrompt: {
                ...state.deletePrompt,
                id: null,
                visibility: false
            },
            snackbarVisible: snackbarMessage ? true : false,
            snackbarMessage: snackbarMessage ? snackbarMessage : ''
        });
    };

    const showDeletePrompt = ({ id, callback }) => {
        setState({
            ...state,
            deletePrompt: {
                id,
                visibility: true,
                callback: state.callback || callback
            }
        });
    };

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
        const mergedFilters = resetRest ? { ...defaultFilters, ...filters } : { ...state.filters, ...filters };
        // Changing the activePage (active nav item) when we are clicking the thumbnail on homepage 
        // and redirecting to history
        const activePage = resetRest ? 'history' : state.activePage;

        setState({
            ...state,
            filters: mergedFilters,
            activePage
        });
        return mergedFilters;
    }

    return (
        <AppContext.Provider value={{
            activePage: state.activePage,
            setActivePage,
            snackbarVisible: state.snackbarVisible,
            snackbarMessage: state.snackbarMessage,
            showSnackbar,
            hideSnackbar,
            deletePrompt: state.deletePrompt,
            hideDeletePrompt,
            showDeletePrompt,
            filters: state.filters,
            setFilters,
        }}>
            {props.children}
        </AppContext.Provider>
    )
}

export { AppContext, AppProvider };