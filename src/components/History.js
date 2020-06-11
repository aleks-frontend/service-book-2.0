import React from 'react';
import { CSSTransition } from 'react-transition-group';
import InfiniteScroll from 'react-infinite-scroll-component';
import styled from 'styled-components';

import ServiceCard from './ServiceCard';
import ServiceForm from './ServiceForm';
import Controls from './UI/Controls';
import Popup from './UI/Popup';
import Button from './UI/Button';
import PrintPopup from './UI/PrintPopup';
import Legend from './UI/Legend';
import GridBasic from './UI/GridBasic';
import TopBar from './UI/TopBar';
import LoadingSpinner from './UI/LoadingSpinner';
import FilterCriteriaEmpty from './UI/FilterCriteriaEmpty';
import { AppContext } from './AppProvider';
import fetchApi from '../fetchApi';
import { fields } from '../helpers';

import { getAppToken } from '../auth';
import singleLineString from '../singleLineString';

const HistoryMain = styled.div`
    width: 100%;
`;

const History = (props) => {
    const context = React.useContext(AppContext);
    const token = getAppToken();

    /** Setting up the state **/
    const [state, setState] = React.useState({
        loaded: false,
        showPopup: false,
        popupServiceId: '',
        showNoServiceMessage: false,
        showPrintPopup: false,
        printedService: null,
        pagesLoaded: 0
    });

    React.useEffect(() => {
        // Using props.historyFilters for the case when we are redirecting from the homepage (thumbnail click)
        fetchServices(props.historyFilters);
    }, []);

    const fetchServices = async ({ searchText, sortCriteria, sortDirection, status, isScrolled } = {}) => {
        // Setting the loaded state to false to show the loading spinner
        setState({ ...state, loaded: false });

        let pagesLoaded = isScrolled ? state.pagesLoaded : 0;
        const urlStatus = status || context.filters.status;

        props.fetchData({
            urlStatus,
            searchText,
            sortCriteria,
            sortDirection,
            isScrolled
        });

        setState({
            ...state,
            pagesLoaded: ++pagesLoaded
        });
    }

    /** Custom methods for updating the sortCriteria and deletedServiceId states **/
    const updateSortCriteria = (value) => setState({
        ...state,
        sortCriteria: value
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
        if (props.services.length === 0 && state.loaded) {
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

        return props.services.map(service => renderHistoryCard(service));
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
            <ServiceCard
                key={service.id}
                id={service.id}
                service={service}
                deleteService={() => props.deleteService({ reload: false, id: service._id })}
                updateService={(updatedService) => {
                    return props.updateService({
                        reload: false,
                        service: updatedService
                    })
                }}
                printService={props.printService}
            />
        </CSSTransition>
    );

    // const renderUpdateServicePopup = () => {
    //     if (state.showPopup) {
    //         return (
    //             <Popup hidePopup={hidePopup}>
    //                 <ServiceForm
    //                     isUpdate={true}
    //                     showSnackbar={props.showSnackbar}
    //                     fields={fields}
    //                     service={state.popupService}
    //                     updateService={updateServices}
    //                     hidePopup={hidePopup}
    //                 />
    //             </Popup>
    //         )
    //     }
    // }

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
                    dataLength={props.services.length} //This is important field to render the next data
                    next={() => fetchServices({ isScrolled: true })}
                    hasMore={props.hasMore}
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
                                onClick={() => {
                                    window.scroll({ top: 0, left: 0, behavior: 'smooth' })
                                }}>Scroll to the top
                            </Button>
                        </p>
                    }>
                    <GridBasic>
                        {renderServices()}
                    </GridBasic>
                </InfiniteScroll>
            </HistoryMain>
        </React.Fragment>
    );
}

export default History;
