import React from 'react';
import CreatableSelect from 'react-select/async-creatable';

import Button from './UI/Button.js'
import { AppContext } from './AppProvider';
import createEntityAPI from '../API/createEntity';
import getEntityByIdAPI from '../API/getEntityById';

import { StyledTable, StyledTableCell } from './styled-components/styledTable';

const priceInputRefs = {};

const ActionsTable = (props) => {
    const context = React.useContext(AppContext);
    // const { actions: appActions } = context.state.ssot;
    
    const [state, setState] = React.useState({
        actionRows: props.actions
    });        

    /** State control methods **/
    const addActionRow = () => {
        const actionRow = {
            id: "",
            quantity: 1,
            price: 0
        };

        setState({...state, actionRows: [
            ...state.actionRows,
            actionRow
        ]});
    }

    const updateActionRowState = ({ rowId, value, key, price, name }) => {
        const actionRowsStateCopy = [ ...state.actionRows ];
        
        for ( const actionRowsStateCopyItem of actionRowsStateCopy ) {
            if ( Number(actionRowsStateCopyItem.rowId) === Number(rowId) ) {
                actionRowsStateCopyItem[key] = value;
                // Checking if we selected the exisitng action
                // Preseting the price in this case
                if ( price !== undefined ) {
                    actionRowsStateCopyItem.price = price;
                    actionRowsStateCopyItem.name = name;
                }
                break;
            }
        }

        setState({...state, actionRows: actionRowsStateCopy});

        // Validating rows and sending to ServiceForm
        validateAndSendToServiceForm(actionRowsStateCopy);
    }

    const validateAndSendToServiceForm = (actionRowsStateCopy) => {
        let validatedActionRows = actionRowsStateCopy.filter(actionRow => ( 
            actionRow.id !== "" && actionRow.quantity !== "" && actionRow.price !== "" )
        );

        props.updateServiceFormActionsState(validatedActionRows);        
    }

    const focusPriceInput = (rowId) => {
        priceInputRefs[rowId].focus();
    }

    /** Event Handler Methods **/
    const handleDropdownChange = async (event, actionMeta) => {
        const rowId = actionMeta.name;
        const value = event.value;
        const action = await getEntityByIdAPI({
            token: context.token, 
            entityName: 'actions', 
            id: value
        }); 
        
        updateActionRowState({ 
            rowId, 
            value, 
            key: 'id', 
            price: action.price,
            name: action.name
        });
        focusPriceInput(rowId);
    }

    const handleInputChange = (event) => {
        const rowId = event.target.getAttribute('actionrowid');
        const value = event.target.value;
        const key = event.target.name;

        updateActionRowState({ rowId, value, key });
    }

    const handleInputFocus = (event) => event.target.select();

    const handleCreateAction = async (event) => {
        const rowId = state.actionRows[state.actionRows.length - 1].rowId;
        const newAction = await createEntityAPI({
            entityName: 'actions',
            entityData: {
                name: event, 
                price: 0
            },
            token: context.token
        });

        console.log(newAction);

        updateActionRowState({ 
            rowId, 
            value: newAction._id,  
            key: 'id',
            price: 0,
            name: newAction.name 
        });

        focusPriceInput(rowId);
    }

    const handleDeleteClick = (rowId) => {
        const actionRowsStateCopy = [ ...state.actionRows ].filter(row => row.rowId !== rowId);

        setState({...state, actionRows: actionRowsStateCopy});
        // Validating rows and sending to ServiceForm
        validateAndSendToServiceForm(actionRowsStateCopy);
    }

    /** Render Methods **/
    const renderTableHeader = () => {
        if (state.actionRows.length) {
            return (
                <React.Fragment>
                    <div className="headerBg"></div>
                    <StyledTableCell header={true} col={1}>Name</StyledTableCell>
                    <StyledTableCell header={true} col={2}>Quantity</StyledTableCell>
                    <StyledTableCell header={true} col={3}>Price</StyledTableCell>
                </React.Fragment>
            );
        }
    }

    const renderRows = () => {
        if ( state.actionRows.length === 0 ) return null;

        return state.actionRows.map((actionRow, index) => {
            actionRow.rowId = index;

            return (
                <React.Fragment key={actionRow.rowId}>
                    <CreatableSelect
                        cacheOptions={true}
                        defaultOptions={true}
                        loadOptions={(inputValue) => props.getEntityDropdownOptions({ inputValue, entityName: 'actions' })}
                        className="select"
                        autoFocus={true}
                        name={actionRow.rowId}
                        value={actionRow.id !== '' ? {
                            value: actionRow.id,
                            label: actionRow.name
                        } : ''}
                        onChange={handleDropdownChange}
                        onCreateOption={handleCreateAction}
                        isValidNewOption={(inputValue) => {
                            if ( inputValue !== "" && index === state.actionRows.length - 1 ) {
                                return true;
                            }
                        }}
                        tabSelectsValue={false}
                    />
                    <StyledTableCell col={2}>
                        <input 
                            actionrowid={actionRow.rowId}
                            value={actionRow.quantity} 
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            type="number"
                            name="quantity"
                        />
                    </StyledTableCell>
                    <StyledTableCell col={3} alerted={actionRow.price === 0}>
                        $<input                          
                            actionrowid={actionRow.rowId}
                            value={actionRow.price} 
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            type="number"
                            name="price"
                            ref={(input) => { priceInputRefs[actionRow.rowId] = input }}
                        />
                        <div 
                            className="closex"
                            onClick={() => handleDeleteClick(actionRow.rowId)}
                        >x</div>
                    </StyledTableCell>
                </React.Fragment>
            );
        })
    }

    const renderTotal = () => {
        if ( !state.actionRows ) return null;
        
        return state.actionRows.reduce((total, row) => {
            return total + Number(row.price * row.quantity);
        }, 0);
    }

    return (
        <StyledTable>
            {renderTableHeader()}
            {renderRows()}
            <div className="footer">
                <Button 
                    onClick={addActionRow}
                    type="button"
                >Add Action</Button>
                <div className="total">Total: {renderTotal()}</div>
            </div>
        </StyledTable>
    );
};

export default ActionsTable;