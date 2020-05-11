import React from 'react';
import { CSSTransition } from 'react-transition-group';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

import HistoryCard from './HistoryCard';
import ServiceForm from './ServiceForm';
import Controls from './UI/Controls';
import DeletePrompt from './UI/DeletePrompt';
import Popup from './UI/Popup';
import Button from './UI/Button';
import PrintPopup from './UI/PrintPopup';
import Legend from './UI/Legend';
import GridBasic from './UI/GridBasic';
import TopBar from './UI/TopBar';
import LoadingSpinner from './UI/LoadingSpinner';
import FilterCriteriaEmpty from './UI/FilterCriteriaEmpty';
import { AppContext } from './AppProvider';
import getServicesAPI from '../API/getServices';
import { fields } from '../helpers';

const HistoryMain = styled.div`
    width: 100%;
`;

const History = (props) => {
    const context = React.useContext(AppContext);

    /** Setting up the state **/
    const [state, setState] = React.useState({
        loaded: false,
        showPopup: false,
        popupServiceId: '',
        deletedServiceId: null,
        showNoServiceMessage: false,
        showPrintPopup: false,
        printedService: null,
        services: [],
        pagesLoaded: 0,
        hasMore: true
    });

    React.useEffect(() => {
        // Using props.historyFilters for the case when we are redirecting from the homepage (thumbnail click)
        fetchServices(props.historyFilters);
    }, []);

    const fetchServices = async ({ searchText, sortCriteria, sortDirection, status, isScrolled } = {}) => {
        // Setting the loaded state to false to show the loading spinner
        setState({ ...state, loaded: false });

        let pagesLoaded = isScrolled ? state.pagesLoaded : 0;

        const result = await getServicesAPI({
            query: {
                page: pagesLoaded,
                pageSize: 20,
                search: searchText === undefined ? context.filters.searchText : searchText,
                orderByColumn: sortCriteria || context.filters.sortCriteria,
                orderDirection: sortDirection || context.filters.sortDirection,
                statusActiveFilters: status || context.filters.status
            },
            token: context.token
        });

        const { services, hasMore } = result;

        setState({
            ...state,
            services: isScrolled ? [...state.services, ...services] : services,
            hasMore,
            loaded: true,
            pagesLoaded: ++pagesLoaded
        });
    }

    const updateServices = (service) => {

        const servicesStateCopy = [...state.services];
        // Getting the index of the updated service
        const indexToBeUpdated = servicesStateCopy.findIndex(serviceCopy => serviceCopy.id === service.id);

        servicesStateCopy[indexToBeUpdated] = service;

        setState({
            ...state,
            services: servicesStateCopy,
            showPopup: false
        });
    };

    const deleteService = (id) => {
        const servicesStateCopy = [...state.services];
        // Getting the index of the deleted service
        const indexToBeDeleted = servicesStateCopy.findIndex(serviceCopy => serviceCopy._id === id);

        servicesStateCopy.splice(indexToBeDeleted, 1);

        setState({
            ...state,
            services: servicesStateCopy,
            deletedServiceId: null,
            showPopup: false
        });
    }

    /** Custom methods for updating the sortCriteria and deletedServiceId states **/
    const updateSortCriteria = (value) => setState({
        ...state,
        sortCriteria: value
    });

    const updateDeletedServiceId = (value) => setState({
        ...state,
        deletedServiceId: value
    });

    /** Helper methods for hiding the showing the popup **/
    const hidePopup = () => setState({ ...state, showPopup: false });
    const setShowPopup = (service) => {
        setState({
            ...state,
            showPopup: true,
            popupService: service
        });
    }

    /** Helper methods for hiding the showing the print popup **/
    const hidePrintPopup = () => setState({ ...state, showPrintPopup: false });
    const showPrintPopup = (service) => {
        setState({
            ...state,
            showPrintPopup: true,
            printedService: service
        });
    }

    let searchTimeout;

    /** Event Handler Methods **/
    const handleSearchInputChange = (value) => {
        clearTimeout(searchTimeout);

        // Adding a setTimeout so the state is not updated on 
        // each key press event while the user is typing
        searchTimeout = setTimeout(() => {
            const activeFilters = context.setFilters({ searchText: value });
            fetchServices(activeFilters);
        }, 500);
    }

    const handleSortCriteriaChange = (value) => {
        const activeFilters = context.setFilters({ sortCriteria: value });
        fetchServices(activeFilters);
    };

    const handleSortDirectionClick = () => {
        const direction = context.filters.sortDirection === 'desc' ? 'asc' : 'desc';
        const activeFilters = context.setFilters({ sortDirection: direction });
        fetchServices(activeFilters);
    }

    /** Render Methods **/
    const renderServices = () => {
        // Checking if no service matches the searched text
        if (state.services.length === 0 && state.loaded) {
            if (state.showNoServiceMessage === false) {
                setState({
                    ...state,
                    showNoServiceMessage: true
                });
            }
        } else {
            if (state.showNoServiceMessage === true) {
                setState({
                    ...state,
                    showNoServiceMessage: false
                });
            }
        }

        return state.services.map(service => renderHistoryCard(service));
    }

    const renderHistoryCard = (service) => (
        <CSSTransition
            key={service.id}
            in={true}
            timeout={500}
            classNames="card"
            unmountOnExit
            appear
        >
            <HistoryCard
                key={service.id}
                id={service.id}
                service={service}
                updateDeletedServiceId={updateDeletedServiceId}
                renderUpdateServicePopup={renderUpdateServicePopup}
                showPopup={setShowPopup}
                showPrintPopup={showPrintPopup}
            />
        </CSSTransition>
    );

    const renderDeletePrompt = () => {
        if (state.deletedServiceId) {
            return (
                <DeletePrompt
                    id={state.deletedServiceId}
                    updateDeletedServiceId={updateDeletedServiceId}
                    deleteService={deleteService}
                />);
        }
    }

    const renderUpdateServicePopup = () => {
        if (state.showPopup) {
            return (
                <Popup hidePopup={hidePopup}>
                    <ServiceForm
                        isUpdate={true}
                        showSnackbar={props.showSnackbar}
                        fields={fields}
                        service={state.popupService}
                        updateHistoryStateServices={updateServices}
                        hidePopup={hidePopup}
                    />
                </Popup>
            )
        }
    }

    const renderPrintPopup = () => {
        if (state.showPrintPopup) {
            return (
                <Popup hidePopup={hidePrintPopup}>
                    <PrintPopup
                        service={state.printedService}
                        hidePopup={hidePrintPopup}
                    />
                </Popup>
            )
        }
    }

    return (
        <React.Fragment>
            {renderDeletePrompt()}
            <TopBar>
                <Legend fetchServices={fetchServices} />
                <Controls
                    handleSearchInputChange={handleSearchInputChange}
                    handleSortCriteriaChange={handleSortCriteriaChange}
                    handleSortDirectionClick={handleSortDirectionClick}
                    updateSortCriteria={updateSortCriteria}
                />
            </TopBar>
            {state.showNoServiceMessage && <FilterCriteriaEmpty>No service meets the filtered criteria!</FilterCriteriaEmpty>}
            <HistoryMain>
                <InfiniteScroll
                    dataLength={state.services.length} //This is important field to render the next data
                    next={() => fetchServices({ isScrolled: true })}
                    hasMore={state.hasMore}
                    loader={
                        <div style={{
                            position: 'relative',
                            gridColumn: '1 / -1',
                            height: '38rem'
                        }}>
                            <LoadingSpinner />
                        </div>
                    }
                    endMessage={
                        <p style={{ textAlign: 'center' }}>
                            <Button 
                                margin='2rem 0 0'
                                compact={false}
                                onClick={() =>  {
                                    window.scroll({ top: 0 , left: 0, behavior: 'smooth' })
                                }}>Scroll to the top
                            </Button>
                        </p>
                    }>
                    <GridBasic>
                        {renderServices()}
                    </GridBasic>
                </InfiniteScroll>
            </HistoryMain>
            {renderUpdateServicePopup()}
            {renderPrintPopup()}
        </React.Fragment>
    );
}

export default History;
