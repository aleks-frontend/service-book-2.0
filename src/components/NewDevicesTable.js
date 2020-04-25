import React from 'react';

import CreateEntity from './CreateEntity';
import Popup from './UI/Popup';
import Button from './UI/Button.js';
import { StyledTable, StyledTableCell } from './styled-components/styledTable';
import { AppContext } from './AppProvider';

const NewDevicesTable = (props) => {
    const context = React.useContext(AppContext);

    const [state, setState] = React.useState({
        newDeviceRows: props.newDevices,
        showPopup: false
    });

    /** State control methods **/
    const addNewDeviceRow = (id, entity) => {
        const newDeviceRow = {
            id,
            name: entity.name,
            quantity: 1,
            price: 0
        };

        const newDeviceRowsStateCopy = [
            ...state.newDeviceRows,
            newDeviceRow
        ];

        setState({
            ...state, 
            newDeviceRows: newDeviceRowsStateCopy, 
            showPopup: false
        });

        // Validating rows and sending to ServiceForm
        validateAndSendToServiceForm(newDeviceRowsStateCopy);
    }

    const updateNewDeviceRowsState = ({ rowId, value, key }) => {
        const newDeviceRowsStateCopy = [...state.newDeviceRows];

        for (const newDeviceRowsStateCopyItem of newDeviceRowsStateCopy) {
            if (Number(newDeviceRowsStateCopyItem.rowId) === Number(rowId)) {
                newDeviceRowsStateCopyItem[key] = value;
                break;
            }
        }

        setState({ ...state, newDeviceRows: newDeviceRowsStateCopy });

        // Validating rows and sending to ServiceForm
        validateAndSendToServiceForm(newDeviceRowsStateCopy);
    }

    const validateAndSendToServiceForm = (newDeviceRowsStateCopy) => {
        let validatedNewDeviceRows = newDeviceRowsStateCopy.filter(newDeviceRow => (
            newDeviceRow.id !== "" && newDeviceRow.quantity !== "" && newDeviceRow.price !== "")
        );

        props.updateServiceFormNewDevicesState(validatedNewDeviceRows);
    }

    /** Helper method for adding the new entity to the local state **/
    const addEntityToLocalState = ({ entity, id }) => addNewDeviceRow(id, entity);

    /** Event Handler Methods **/

    const handleInputChange = (event) => {
        const rowId = event.target.getAttribute('newdevicesrowid');
        const value = event.target.value;
        const key = event.target.name;

        updateNewDeviceRowsState({ rowId, value, key });
    }

    const handleInputFocus = (event) => event.target.select();

    const handleDeleteClick = (rowId) => {
        const newDeviceRowsStateCopy = [...state.newDeviceRows].filter(row => row.rowId !== rowId);

        setState({ ...state, newDeviceRows: newDeviceRowsStateCopy });
        // Validating rows and sending to ServiceForm
        validateAndSendToServiceForm(newDeviceRowsStateCopy);
    }

    const hidePopup = () => setState({ ...state, showPopup: false });
    const showPopup = () => setState({ ...state, showPopup: true });

    /** Render Methods **/
    const renderTableHeader = () => {
        if (state.newDeviceRows.length === 0) return null;

        return (
            <React.Fragment>
                <div className="headerBg"></div>
                <StyledTableCell header={true} col={1}>Name</StyledTableCell>
                <StyledTableCell header={true} col={2}>Quantity</StyledTableCell>
                <StyledTableCell header={true} col={3}>Price</StyledTableCell>
            </React.Fragment>
        );
    }

    const renderRows = () => {
        if (state.newDeviceRows.length === 0) return null;

        return state.newDeviceRows.map((newDeviceRow, index) => {
            newDeviceRow.rowId = index;

            return (
                <React.Fragment key={newDeviceRow.rowId}>
                    <StyledTableCell col={1}>
                        <input
                            newdevicesrowid={newDeviceRow.rowId}
                            value={newDeviceRow.name}
                            // onChange={handleInputChange}
                            type="text"
                            name="id"
                            readOnly={true}
                        />
                    </StyledTableCell>
                    <StyledTableCell
                        col={2}
                        alerted={newDeviceRow.quantity === '0' || newDeviceRow.quantity === ''}
                    >
                        <input
                            newdevicesrowid={newDeviceRow.rowId}
                            value={newDeviceRow.quantity}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            type="number"
                            name="quantity"
                        />
                    </StyledTableCell>
                    <StyledTableCell
                        col={3}
                        alerted={newDeviceRow.price === '0' || newDeviceRow.price === 0 || newDeviceRow.price === ''}
                    >
                        $<input
                            newdevicesrowid={newDeviceRow.rowId}
                            value={newDeviceRow.price}
                            onChange={handleInputChange}
                            onFocus={handleInputFocus}
                            autoFocus={true}
                            type="number"
                            name="price"
                        />
                        <div
                            className="closex"
                            onClick={() => handleDeleteClick(newDeviceRow.rowId)}
                        >x</div>
                    </StyledTableCell>
                </React.Fragment>
            );
        })
    }

    const renderTotal = () => {
        if (!state.newDeviceRows) return null;

        return state.newDeviceRows.reduce((total, row) => {
            return total + Number(row.price * row.quantity);
        }, 0);
    }

    const renderCreateNewDevicePopup = () => {
        if (!state.showPopup) {
            return null;
        }
        return (
            <React.Fragment>
                <Popup hidePopup={hidePopup}>
                    <CreateEntity
                        name=""
                        addEntityToLocalState={addEntityToLocalState}
                        stateName="devices"
                        entityLabel="device"
                        fields={props.fields}
                        isNewDevice={true}
                        showSnackbar={props.showSnackbar}
                        hidePopup={hidePopup}
                    />
                </Popup>
            </React.Fragment>
        );
    }

    return (
        <React.Fragment>
            <StyledTable>
                {renderTableHeader()}
                {renderRows()}
                <div className="footer">
                    <Button
                        onClick={showPopup}
                        type="button"
                    >Add New Device</Button>
                    <div className="total">Total: {renderTotal()}</div>
                </div>
            </StyledTable>
            {renderCreateNewDevicePopup()}
        </React.Fragment>
    );
};

export default NewDevicesTable;