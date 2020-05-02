import React from 'react';
import styled from 'styled-components';
import CreatableSelect from 'react-select/async-creatable';

import { PDFDownloadLink } from '@react-pdf/renderer';

import CreateEntity from './CreateEntity';
import ActionsTable from './ActionsTable';
import NewDevicesTable from './NewDevicesTable';
import Button from './UI/Button';
import PrintButton from './PrintButton';
import LoadingSpinner from './UI/LoadingSpinner';
import PdfDispatchNote from './PDF/PdfDispatchNote';
import { AppContext } from './AppProvider';
import { breakpoints, statusEnum, colors, fields } from '../helpers';

import createServiceAPI from '../API/createService';
import getEntitiesAPI from '../API/getEntities';
import updateServiceAPI from '../API/updateService';
import getEntityByIdAPI from '../API/getEntityById';

const StyledForm = styled.form`
    position: relative;
    overflow: ${props => props.isUpdate ? 'auto' : 'visible'};
    padding: 1.5rem 1.5rem 2.5rem;
    width: 80rem;
    max-width: 100%;
    max-height: ${props => props.isUpdate ? '100%' : 'none'};
    background: ${colors.lightgray2};
    border-radius: 0.4rem;

    .group {
        border: 1px solid transparent;
        margin-bottom: 0.5rem;

        label { 
            display: block;
            padding: 0.5rem 0.3rem;
            font-size: 1.2rem;
            color: #fff;
            background: ${colors.rdgray2};
            border-top-left-radius: 4px; 
            border-top-right-radius: 4px;
            
            @media screen and (${breakpoints.point1}) {
                line-height: 1.2em;
            } 
        }

        input[type="text"], textarea {
            display: block;
            width: 100%;
            padding: 0 0.5rem;
            height: 3.8rem;
            border: none;
            border-bottom-left-radius: 4px; 
            border-bottom-right-radius: 4px; 
            
            &:focus { outline: none; }
        }

        textarea { height: 6rem; } 

        select {
            width: 100%;
            height: 3rem; }

        &.empty-required { 
            color: red;
            border-color: red; }

        .select { 
            flex: 1; 
            border: none; }
    }
`;

const ServiceForm = (props) => {
    const context = React.useContext(AppContext);
    const defaultStates = {
        inputs: {
            description: {
                value: props.isUpdate ? props.service.description : "",
                required: true,
            },
            customer: {
                value: props.isUpdate ? props.service.customer.id : "",
                required: true,
            },
            devices: {
                value: props.isUpdate ? props.service.devices : "",
                required: true,
                isArray: true,
            },
            status: {
                value: props.isUpdate ? props.service.status : statusEnum.RECEIVED,
                required: false,
                show: props.isUpdate
            },
            id: {
                value: props.isUpdate ? props.service.id : String(new Date().getTime()),
                required: false
            },
            remark: {
                value: props.isUpdate ? props.service.remark : "",
                required: false,
                show: props.isUpdate
            },
            actions: {
                value: props.isUpdate ? props.service.actions : [],
                isArray: true,
                required: false,
                show: props.isUpdate
            },
            newDevices: {
                value: props.isUpdate ? props.service.newDevices : [],
                required: false,
                show: props.isUpdate
            }

        },
        selectedDropdownItems: {
            customer: props.isUpdate ? { label: props.service.customer.name, value: props.service.customer.id } : '',
            devices: props.isUpdate ? props.service.devices.map(device => {
                return { label: device.name, value: device.id }
            }) : '',
        }
    }

    /** Setting up the state **/
    const [state, setState] = React.useState({
        showCreateEntity: {
            customer: { show: false },
            devices: { show: false }
        },
        inputs: defaultStates.inputs,
        selectedDropdownItems: defaultStates.selectedDropdownItems,
        emptyRequiredInputs: {},
        showGeneratedPdfButton: false,
        tempInputs: {},
        dispatchNoteTriggered: false,
        pdfBlob: null,
        pdfGenerated: false
    });

    /** Helpper method for updating the state **/
    const updateState = ({ stateKey, stateObjKey, value = '', stateObjCopy }) => {
        // We are not updating the actual state in this case
        // Used for cases when we are calling updateState several times in a single method
        if (stateObjCopy) {
            if (stateObjKey) {
                stateObjCopy[stateKey] = {
                    ...stateObjCopy[stateKey],
                    [stateObjKey]: value
                };
            } else {
                stateObjCopy[stateKey] = value;
            }
        } else {
            // This part will be used when we are calling the updateState once in a method
            // This will update the state directly
            if (stateObjKey) {
                setState({
                    ...state, [stateKey]: {
                        ...state[stateKey],
                        [stateObjKey]: value
                    }
                });
            } else {
                setState({ ...state, [stateKey]: value });
            }
        }
    }

    /** Additional helper method for updating the Actions state - 
     *  because of the different state structure  **/
    const updateActionsState = (actionRows) => {
        updateState({
            stateKey: 'inputs',
            stateObjKey: 'actions',
            value: {
                ...state.inputs.actions,
                value: actionRows
            }
        });
    }

    const updateNewDevicesState = (newDevicesRows) => {
        updateState({
            stateKey: 'inputs',
            stateObjKey: 'newDevices',
            value: {
                ...state.inputs.newDevices,
                value: newDevicesRows
            }
        });
    }

    /** Helper method for hiding the Create Entity Form **/
    const hideCreateEntityForm = (entityType, stateCopy) => {
        return updateState({
            stateKey: 'showCreateEntity',
            stateObjKey: entityType,
            value: { show: false },
            stateObjCopy: stateCopy
        })
    };

    /** Helper method for reseting the form after it's submitted **/
    const formReset = () => {
        const stateCopy = { ...state };

        updateState({
            stateKey: 'inputs',
            stateObjKey: null,
            value: defaultStates.inputs,
            stateObjCopy: stateCopy
        });
        updateState({
            stateKey: 'selectedDropdownItems',
            stateObjKey: null,
            value: defaultStates.selectedDropdownItems,
            stateObjCopy: stateCopy
        });
        updateState({
            stateKey: 'showGeneratedPdfButton',
            stateObjKey: null,
            value: false,
            stateObjCopy: stateCopy
        });
        updateState({
            stateKey: 'pdfGenerated',
            stateObjKey: null,
            value: false,
            stateObjCopy: stateCopy
        });

        setState(stateCopy);
    }

    /** Helper method for adding the new entity to the local state **/
    const addEntityToLocalState = ({ entity, stateKey, isMulti, id }) => {
        const stateCopy = { ...state };

        if (!isMulti) {
            updateState({
                stateKey: 'selectedDropdownItems',
                stateObjKey: stateKey,
                value: {
                    value: id,
                    label: entity.name
                },
                stateObjCopy: stateCopy
            });
        } else {
            updateState({
                stateKey: 'selectedDropdownItems',
                stateObjKey: stateKey,
                value: [
                    ...stateCopy.selectedDropdownItems[stateKey],
                    {
                        value: id,
                        label: entity.name
                    }
                ],
                stateObjCopy: stateCopy
            });
        }

        updateState({
            stateKey: 'inputs',
            stateObjKey: stateKey,
            value: {
                ...stateCopy.inputs[stateKey],
                value: isMulti ? [...stateCopy.inputs[stateKey].value, id] : id
            },
            stateObjCopy: stateCopy
        });

        hideCreateEntityForm(stateKey, stateCopy);

        setState({ ...stateCopy });
    }

    /** Event Handler Methods **/
    const handleInputChange = (event) => {
        updateState({
            stateKey: 'inputs',
            stateObjKey: event.target.name,
            value: {
                ...state.inputs[event.target.name],
                value: event.target.value
            }
        });
    }

    const handleCreateCustomer = (event) => {
        updateState({
            stateKey: 'showCreateEntity',
            stateObjKey: 'customer',
            value: { show: true, name: event }
        });
    }

    const handleCreateDevice = (event) => {
        updateState({
            stateKey: 'showCreateEntity',
            stateObjKey: 'devices',
            value: { show: true, name: event }
        });
    }

    const handleDropdownChange = (event, actionMeta) => {
        let id;
        const stateCopy = { ...state };
        if (Array.isArray(event)) {
            id = event.map(obj => obj.value);
        } else {
            if (event !== null) {
                id = event.value;
            }
        }

        updateState({
            stateKey: 'showCreateEntity',
            stateObjKey: actionMeta.name,
            value: { show: false, name: '' },
            stateObjCopy: stateCopy
        });

        if (event === null) {
            updateState({
                stateKey: 'selectedDropdownItems',
                stateObjKey: actionMeta.name,
                stateObjCopy: stateCopy
            });
        } else if (!Array.isArray(event)) {
            updateState({
                stateKey: 'selectedDropdownItems',
                stateObjKey: actionMeta.name,
                value: {
                    value: event.value,
                    label: event.label
                },
                stateObjCopy: stateCopy
            });
        } else {
            const selectedDropdownItemsArr = event.map(item => (
                {
                    value: item.value,
                    label: item.label
                }
            ));

            updateState({
                stateKey: 'selectedDropdownItems',
                stateObjKey: actionMeta.name,
                value: selectedDropdownItemsArr,
                stateObjCopy: stateCopy
            });
        }

        updateState({
            stateKey: 'inputs',
            stateObjKey: actionMeta.name,
            value: {
                ...state.inputs[actionMeta.name],
                value: id
            },
            stateObjCopy: stateCopy
        });

        // We are now setting the stateCopy to the actual state
        setState(stateCopy);
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        let inputValues = {};
        const emptyRequiredInputsCopy = { ...state.emptyRequiredInputs };
        for (const key of Object.keys(state.inputs)) {
            const input = state.inputs[key];

            if (input.show === false) {
                inputValues[key] = defaultStates.inputs[key].value;
                continue;
            }

            let inputVal = input.value;


            // check for missing required fields here!
            const emptyArrayCheck = input.isArray && inputVal === "";
            // const emptyNumCheck = typeof inputVal === 'number' && inputVal === 0;
            const emptyStringCheck = typeof inputVal === 'string' && inputVal === '';

            if (input.required) {
                if (emptyArrayCheck || emptyStringCheck) {
                    emptyRequiredInputsCopy[key] = 'empty-required';
                } else {
                    delete emptyRequiredInputsCopy[key];
                }
            }

            inputValues[key] = inputVal;
        }

        let stateCopy = { ...state };
        updateState({
            stateKey: 'emptyRequiredInputs',
            stateObjKey: null,
            value: emptyRequiredInputsCopy,
            stateObjCopy: stateCopy
        });
        if (Object.keys(emptyRequiredInputsCopy).length) {
            setState(stateCopy);
            context.showSnackbar('Required field(s) missing');
        } else {
            if (!props.isUpdate) {
                try {
                    const service = await createServiceAPI({
                        serviceData: inputValues,
                        token: context.token
                    });

                    // Adding new service to the state, so we can pass it to PDF Dispatch note
                    updateState({
                        stateKey: 'service',
                        stateObjKey: null,
                        value: service,
                        stateObjCopy: stateCopy
                    });

                    // Adding new service customer to the state, so we can pass it to PDF Dispatch note
                    const customer = getEntityByIdAPI({
                        token: context.token,
                        entityName: 'customers',
                        id: service.customer.id,
                        async: false
                    });

                    updateState({
                        stateKey: 'customer',
                        stateObjKey: null,
                        value: customer,
                        stateObjCopy: stateCopy
                    });
                    // Showing the 'Generate PDF' button
                    updateState({
                        stateKey: 'showGeneratedPdfButton',
                        stateObjKey: null,
                        value: true,
                        stateObjCopy: stateCopy
                    });
                    // Saving current inputs from the stateCopy to 'tempInputs' state
                    // cause 'inputs' state will be reset before the PDF is generated
                    // so we temporary store it here and pass this data to PdfDispatchNote 
                    updateState({
                        stateKey: 'tempInputs',
                        stateObjKey: null,
                        value: stateCopy['inputs'],
                        stateObjCopy: stateCopy
                    });
                    context.showSnackbar('new service was created successfully');
                    setState(stateCopy);
                } catch (err) {
                    context.showSnackbar(err);
                }
            } else {
                const updatedInputValues = {};

                for (const inputValueKey of Object.keys(inputValues)) {
                    if (inputValueKey === 'devices') {
                        updatedInputValues.devices = [];
                        for (const device of inputValues['devices']) {
                            updatedInputValues.devices.push(device.id);
                        }
                    } else if (inputValueKey === 'actions') {
                        updatedInputValues.actions = [];
                        for (const action of inputValues['actions']) {
                            updatedInputValues.actions.push({
                                id: action.id,
                                price: action.price,
                                quantity: action.quantity
                            });
                        }
                    } else if (inputValueKey === 'newDevices') {
                        updatedInputValues.newDevices = [];
                        for (const newDevice of inputValues['newDevices']) {
                            updatedInputValues.newDevices.push({
                                id: newDevice.id,
                                price: newDevice.price,
                                quantity: newDevice.quantity
                            });
                        }
                    } else {
                        updatedInputValues[inputValueKey] = inputValues[inputValueKey];
                    }
                }

                const updatedService = await updateServiceAPI({
                    token: context.token,
                    inputValues: updatedInputValues,
                    id: props.service._id
                });

                // update History state here !!!
                props.updateHistoryStateServices(updatedService);
                context.showSnackbar('Service updated');
            }
        }
    }

    /** Render Methods **/
    const renderCreateCustomer = () => {
        const customerFields = fields.customers;

        if (state.showCreateEntity['customer'].show) {
            return <CreateEntity
                presetVal={state.showCreateEntity['customer'].name}
                addEntityToLocalState={addEntityToLocalState}
                stateName="customer"
                endpointName="customers"
                entityLabel="customer"
                fields={customerFields}
                isMulti={false}
                hidePopup={() => hideCreateEntityForm('customer')}
            />;
        }
    }

    const renderCreateDevice = () => {
        const deviceFields = fields.devices;

        if (state.showCreateEntity['devices'].show) {
            return <CreateEntity
                presetVal={state.showCreateEntity['devices'].name}
                addEntityToLocalState={addEntityToLocalState}
                stateName="devices"
                entityLabel="device"
                fields={deviceFields}
                isMulti={true}
                hidePopup={() => hideCreateEntityForm('devices')}
            />;
        }
    }

    const renderUpdateFields = () => {
        if (props.isUpdate) {
            return (
                <React.Fragment>
                    <div className="group">
                        <label>Actions:</label>
                        <ActionsTable
                            actions={state.inputs.actions.value}
                            updateServiceFormActionsState={updateActionsState}
                            getEntityDropdownOptions={getEntityDropdownOptions}
                        />
                    </div>
                    <div className="group">
                        <label>New Devices:</label>
                        <NewDevicesTable
                            fields={fields.devices}
                            newDevices={state.inputs.newDevices.value}
                            updateServiceFormNewDevicesState={updateNewDevicesState}
                        />
                    </div>
                    <div className="group">
                        <label>Remarks:</label>
                        <textarea
                            name="remark"
                            value={state.inputs.remark.value}
                            onChange={handleInputChange}
                        ></textarea>
                    </div>
                    <div className="group">
                        <label>Status:</label>
                        <select
                            name="status"
                            value={state.inputs.status.value}
                            onChange={handleInputChange}
                        >
                            <option value={statusEnum.RECEIVED}>Received</option>
                            <option value={statusEnum.INPROGRESS}>In Progress</option>
                            <option value={statusEnum.COMPLETED}>Completed</option>
                            <option value={statusEnum.SHIPPED}>Shipped</option>
                        </select>
                    </div>
                </React.Fragment>
            );
        }
    };

    const renderCancelButton = () => {
        if (props.isUpdate) {
            return (
                <Button
                    type="button"
                    onClick={props.hidePopup}
                    isText={true}
                    isText={true}
                >Cancel</Button>
            );
        }
    }

    const renderResetButton = () => {
        if (state.showGeneratedPdfButton) {
            return (
                <Button
                    type="button"
                    margin="0 0.5rem"
                    onClick={formReset}
                >Reset</Button>
            );
        }
    }


    const renderTest = () => {
        console.log('service form renderer');
        return '';
    }

    const downloadPDF = () => {
        if (state.pdfGenerated) {
            const data = window.URL.createObjectURL(state.pdfBlob);
            const link = document.createElement('a');
            link.href = data;
            link.download = `dispatch-note-${state.service.id}.pdf`;
            link.click();

            formReset();
        }
    };

    const renderDownloadPdfButton = () => {
        if (state.showGeneratedPdfButton) {
            return (
                <React.Fragment>
                    <Button
                        type="button"
                        margin="0 0 0 0.5rem"
                        disabled={!state.pdfGenerated}
                        onClick={downloadPDF}
                    >
                        {state.pdfGenerated ? 'Download PDF' : 'Generating PDF'}
                    </Button>
                    <PDFDownloadLink document={
                        <PdfDispatchNote
                            service={state.service}
                            customer={state.customer}
                        />}
                    >
                        {({ blob, loading }) => {
                            if (!loading && !state.pdfGenerated) {
                                setTimeout(() => {
                                    setState({
                                        ...state,
                                        pdfBlob: blob,
                                        pdfGenerated: true
                                    });
                                }, 0);
                            }
                        }}
                    </PDFDownloadLink>
                </React.Fragment>
            )
        }
    }

    const getEntityDropdownOptions = ({ inputValue, entityName }) => {
        return new Promise(async resolve => {
            const entities = await getEntitiesAPI({
                query: {
                    pageSize: 100,
                    page: 0,
                    search: inputValue,
                    orderBy: 'name',
                    orderDirection: 'asc',
                },
                token: context.token,
                entityName
            });

            const dropdownOptions = entities.data.map(entity => {
                return {
                    value: entity._id,
                    label: entity.name
                }
            });

            resolve(dropdownOptions);
        });
    }

    return (
        <React.Fragment>
            <StyledForm
                onSubmit={handleFormSubmit}
                onClick={e => e.stopPropagation()}
                isUpdate={props.isUpdate}
            >
                <div className='group'>
                    <label>Service ID:</label>
                    <input
                        type="text"
                        name="title"
                        disabled={true}
                        readOnly={true}
                        value={props.service ? props.service.id : ''}
                        onChange={handleInputChange}
                    />
                </div>
                <div
                    className={state.emptyRequiredInputs['description'] ? 'group empty-required' : 'group'}
                >
                    <label>{state.inputs.description.required && '* '}Description:</label>
                    <textarea
                        name="description"
                        disabled={state.showGeneratedPdfButton}
                        value={state.inputs.description.value}
                        onChange={handleInputChange}
                        autoFocus={true}
                    />
                </div>
                <div
                    className={state.emptyRequiredInputs['customer'] ? 'group empty-required' : 'group'}
                >
                    <label>{state.inputs.customer.required && '* '}Customer:</label>
                    <CreatableSelect
                        cacheOptions={true}
                        defaultOptions={true}
                        loadOptions={(inputValue) => getEntityDropdownOptions({ inputValue, entityName: 'customers' })}
                        className="select"
                        name="customer"
                        isDisabled={state.showGeneratedPdfButton}
                        value={state.selectedDropdownItems['customer']}
                        onChange={handleDropdownChange}
                        onCreateOption={handleCreateCustomer}
                        isClearable
                    />
                </div>
                {renderCreateCustomer()}
                <div
                    className={state.emptyRequiredInputs['devices'] ? 'group empty-required' : 'group'}
                >
                    <label>{state.inputs.devices.required && '* '}Devices:</label>
                    <CreatableSelect
                        cacheOptions={true}
                        defaultOptions={true}
                        loadOptions={(inputValue) => getEntityDropdownOptions({ inputValue, entityName: 'devices' })}
                        className="select"
                        value={state.selectedDropdownItems['devices']}
                        isMulti
                        name="devices"
                        isDisabled={state.showGeneratedPdfButton}
                        onCreateOption={handleCreateDevice}
                        onChange={handleDropdownChange}
                    />
                </div>
                {renderCreateDevice()}
                {renderUpdateFields()}
                <Button
                    type="submit"
                    onClick={handleFormSubmit}
                    disabled={state.showGeneratedPdfButton}
                >
                    {props.isUpdate ? 'Update' : 'Create'}
                </Button>
                {renderCancelButton()}
                {renderTest()}
                {renderResetButton()}
                {renderDownloadPdfButton()}
            </StyledForm>
        </React.Fragment>
    );
}

export default ServiceForm;
