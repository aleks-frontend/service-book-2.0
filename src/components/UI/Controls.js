import React from 'react';
import styled from 'styled-components';
import SortArrow from './SortArrow';

import { AppContext } from '../AppProvider';
import { colors, borderRadiuses, breakpoints } from '../../helpers';

const StyledControls = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    @media screen and (min-width: ${breakpoints.tablet}) { 
        flex-direction: row;
    }

    @media screen and (min-width: ${breakpoints.desktop}) { 
        width: 50rem;
    }

    .sort {
        display: flex;
        align-items: center;

        @media screen and (min-width: ${breakpoints.tablet}) { 
            margin-right: 1rem;
            padding: 0 1rem;
        }

        label {
            margin-right: 1rem;
            font-size: 1.2rem;
            color: ${colors.gray} }

        select { 
            flex: 1;
            height: 5rem; 
            color: ${colors.gray};
            border-radius: ${borderRadiuses.small};
            border: none; 

            @media screen and (min-width: ${breakpoints.tablet}) {
                flex: unset;
                height: 3.4rem; 
             }
        }
    }

    input[type="text"] {
        padding: 0 0.5rem;
        margin-bottom: 2rem;
        width: 100%;
        height: 5rem;
        border-radius: ${borderRadiuses.small};
        border: none; 

        @media screen and (min-width: ${breakpoints.tablet}) { 
            flex: 1;
            margin-bottom: 0;
            height: auto;
            max-width: 25rem;
        }
    }
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
