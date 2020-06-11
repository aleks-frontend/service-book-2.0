import React from 'react';

import { AppContext } from './AppProvider';
import fetchApi from '../fetchApi';
import { getAppToken } from '../auth';

import LoadingSpinner from './UI/LoadingSpinner';
import { StyledGridItem } from './styled-components/styledGrid';

/**
 * @param WrappedComponent - component which displays services (History, LastModifiedServices ...)
 * @param loadData - method for getting the services from backend
 * @returns higher order component that displays services
*/

const withServices = (WrappedComponent, loadData) => ({ ...props }) => {
    const context = React.useContext(AppContext);
    const [state, setState] = React.useState({
        services: [],
        showUpdatePopup: false,
        showDeletePopup: false,
        showPrintPopup: false,
        dataLoaded: false,
        hasMore: true,
        pagesLoaded: 0
    });

    React.useEffect(() => {
        fetchData({});
    }, []);

    const fetchData = ({
        urlStatus,
        searchText,
        sortCriteria,
        sortDirection,
        isScrolled
    }) => {
        let pagesLoaded = isScrolled ? state.pagesLoaded : 0;
        debugger;

        loadData({
            pagesLoaded,
            urlStatus,
            searchText,
            sortCriteria,
            sortDirection
        }).then((result) => {
            setState({
                ...state,
                services: isScrolled ? [...state.services, ...result.data.services] : result.data.services,
                hasMore: result.data.hasMore,
                pagesLoaded: ++pagesLoaded,
                dataLoaded: true
            });
        });
    }

    const deleteService = async ({ reload = false, id }) => {
        const response = await fetchApi({
            url: `/services/${id}`,
            method: 'DELETE',
            token: getAppToken()
        });

        if (response.status === 200) {
            const servicesStateCopy = [...state.services];
            // Getting the index of the deleted service
            const indexToBeDeleted = servicesStateCopy.findIndex(serviceCopy => serviceCopy._id === id);

            servicesStateCopy.splice(indexToBeDeleted, 1);

            setState({
                ...state,
                services: servicesStateCopy,
                dataLoaded: !reload
            });

            if (reload) {
                fetchData();
            }

            // context.showSnackbar('Service was succesfully deleted.');
        } else {
            // context.showSnackbar(response.data);
        }

    }

    const updateService = ({ reload = false, service }) => {
        const servicesStateCopy = [...state.services];
        // Getting the index of the updated service
        const indexToBeUpdated = servicesStateCopy.findIndex(serviceCopy => serviceCopy._id === service._id);

        servicesStateCopy[indexToBeUpdated] = service;

        setState({
            ...state,
            services: servicesStateCopy,
            dataLoaded: !reload
        });

        if (reload) {
            fetchData();
        }
    };


    return state.dataLoaded ?
        <WrappedComponent
            services={state.services}
            hasMore={state.hasMore}
            deleteService={deleteService}
            updateService={updateService}
            fetchData={fetchData}
            {...props} />
        :
        <StyledGridItem>
            <LoadingSpinner />
        </StyledGridItem>;
};

export default withServices;
