import React from 'react';
import { CSSTransition } from 'react-transition-group';

import HistoryCard from './HistoryCard';
import ServiceForm from './ServiceForm';
import Controls from './UI/Controls';
// import DeletePrompt from './UI/DeletePrompt';
import Popup from './UI/Popup';
// import PrintPopup from './UI/PrintPopup';
import Legend from './UI/Legend';
import GridBasic from './UI/GridBasic';
import TopBar from './UI/TopBar';
import FilterCriteriaEmpty from './UI/FilterCriteriaEmpty';
import { AppContext } from './AppProvider';
import getServicesAPI from '../API/getServices';
import { fields } from '../helpers';

const History = (props) => {
    const context = React.useContext(AppContext);

    /** Setting up the state **/
    const [state, setState] = React.useState({
        loaded: false,
        showPopup: false,
        popupServiceId: '',
        searchText: '',
        sortCriteria: '',
        sortDirectionAsc: true,
        promptedId: null,
        showNoServiceMessage: false,
        showPrintPopup: false,
        printInputs: {
            customerId: [],
            deviceIds: [],
            title: '',
            remark: ''
        },
        services: []
    });

    React.useEffect(() => {
        // Had to make this as a separate function in order to be able to use `async`
        // useEffect was not allowing to put async in it's callback function
        const fetchServices = async () => {
            const services = await getServicesAPI({
                query: {
                    page: 0,
                    search: '',
                    orderByColumn: 'date',
                    orderDirection: 'desc'
                },
                token: context.token
            });
    
            setState({ ...state, services });
        }

        fetchServices();
    }, []);

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

    /** Custom methods for updating the sortCriteria and promptedId states **/
    const updateSortCriteria = (value) => setState({
        ...state,
        sortCriteria: value
    });

    const updatePromptedId = (value) => setState({
        ...state,
        promptedId: value
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
    const showPrintPopup = ({ serviceId, customerId, deviceIds, title, actions, newDevices, remark, description }) => {
        setState({
            ...state,
            showPrintPopup: true,
            printInputs: {
                serviceId,
                customerId,
                deviceIds,
                title,
                actions,
                newDevices,
                remark,
                description
            }
        });
    }

    let searchTimeout;

    /** Event Handler Methods **/
    const handleSearchInputChange = (value) => {
        clearTimeout(searchTimeout);

        // Adding a setTimeout so the state is not updated on 
        // each key press event while the user is typing
        searchTimeout = setTimeout(() => {
            setState({
                ...state,
                searchText: value
            });
        }, 500);
    }

    const handleSortCriteriaChange = (value) => {
        setState({
            ...state,
            sortCriteria: value
        });
    }

    const handleSortDirectionClick = () => {
        setState({
            ...state,
            sortDirectionAsc: !state.sortDirectionAsc
        });
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
                updatePromptedId={updatePromptedId}
                renderUpdateServicePopup={renderUpdateServicePopup}
                showPopup={setShowPopup}
                showPrintPopup={showPrintPopup}
            />
        </CSSTransition>
    );

    // const renderDeletePrompt = () => {
    //     if (state.promptedId) {
    //         return (
    //             <DeletePrompt
    //                 id={state.promptedId}
    //                 updatePromptedId={updatePromptedId}
    //             />);
    //     }
    // }

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

    // const renderPrintPopup = () => {
    //     if (state.showPrintPopup) {
    //         return (
    //             <Popup hidePopup={hidePrintPopup}>
    //                 <PrintPopup
    //                     serviceId={state.printInputs.serviceId}
    //                     customerId={state.printInputs.customerId}
    //                     deviceIds={state.printInputs.deviceIds}
    //                     title={state.printInputs.title}
    //                     actions={state.printInputs.actions}
    //                     newDevices={state.printInputs.newDevices}
    //                     remark={state.printInputs.remark}
    //                     description={state.printInputs.description}
    //                     hidePopup={hidePrintPopup}
    //                 />
    //             </Popup>
    //         )
    //     }
    // }

    return (
        <React.Fragment>
            {/* {renderDeletePrompt()} */}
            <TopBar>
                <Legend />
                <Controls
                    handleSearchInputChange={handleSearchInputChange}
                    handleSortCriteriaChange={handleSortCriteriaChange}
                    handleSortDirectionClick={handleSortDirectionClick}
                    updateSortCriteria={updateSortCriteria}
                    sortDirectionAsc={state.sortDirectionAsc}
                />
            </TopBar>
            {state.showNoServiceMessage && <FilterCriteriaEmpty>No service meets the filtered criteria!</FilterCriteriaEmpty>}
            <GridBasic>
                {renderServices()}
            </GridBasic>
            {renderUpdateServicePopup()}
            {/* {renderPrintPopup()} */}
        </React.Fragment>
    );
}

export default History;
