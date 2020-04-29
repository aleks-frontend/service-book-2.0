import React from 'react';
import styled from 'styled-components';
import SortArrow from './SortArrow';

import { AppContext } from '../AppProvider';
import { colors } from '../../helpers';

const StyledControls = styled.div`
    display: flex;
    justify-content: space-between;

    .sort {
        display: flex;
        align-items: center;
        padding: 0 1rem;
        margin-right: 1rem;

        label {
            margin-right: 1rem;
            font-size: 1.2rem;
            color: ${colors.gray} }

        select { height: 3.4rem; }
    }

    input[type="text"] {
        padding: 0 0.5rem;
        width: 25rem;
        border-radius: 0.3rem;
        border: 1px solid ${colors.lightgray}; }
`;

const Controls = (props) => {
    const context = React.useContext(AppContext);

    React.useEffect(() => {        
        props.updateSortCriteria(sortInputRef.current.value);
    }, []);

    const filterInputRef = React.createRef();  
    const sortInputRef = React.createRef();

    return (
        <StyledControls>
            <input 
                type="text" 
                placeholder="Search" 
                ref={filterInputRef} 
                defaultValue={context.filters.searchText}
                onChange={() => props.handleSearchInputChange(filterInputRef.current.value)} 
            />
            <div className="sort">
                <label>Sort by: </label>
                <select 
                    ref={sortInputRef} 
                    onChange={() => {
                        props.handleSortCriteriaChange(sortInputRef.current.value)
                    }}
                    defaultValue={context.filters.sortCriteria}
                >
                    <option value="date">Date</option>
                    <option value="customer">Customer Name</option>
                </select>
                <SortArrow 
                    sortDirection={context.filters.sortDirection}
                    handleSortDirectionClick={props.handleSortDirectionClick}     
                />
            </div>            
        </StyledControls>
    );
};

export default Controls;
