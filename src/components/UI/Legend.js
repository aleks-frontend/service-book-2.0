import React from 'react';
import styled from 'styled-components';

import { AppContext } from '../AppProvider';
import { colors, legendItems, breakpoints } from '../../helpers';

const StyledLegend = styled.div`
    display: flex;
    justify-content: space-between;
    margin-bottom: 2.5rem;
    @media screen and (min-width: ${breakpoints.tablet}) {
        justify-content: flex-start;
        margin-bottom: 1.5rem;
    }

    @media screen and (min-width: ${breakpoints.desktop}) { 
        margin-bottom: 0; 
    }
`;

const StyledLegendItem = styled.div`
    display: flex;
    align-items: center;
    margin-right: 1rem;
    opacity: 0.9;
    transition: 0.5s all;

    &:hover { 
        opacity: 1;
        cursor: pointer; }

    .legend__indicator {
        margin-right: 0.5rem;
        width: 6.3rem;
        height: 6.3rem; 
        padding: ${props => props.selected ? '0.3rem' : '0'};
        border: ${props => props.selected ? `0.1rem solid ${colors.rddarkgray}` : 'none'};
        border-radius: ${props => props.selected ? '50%' : '0'};
        transition: 0.3s all;

        @media screen and (min-width: ${breakpoints.tablet}) { 
            width: 3.3rem;
            height: 3.3rem; 
        }
    
        svg path { 
            fill: ${props => props.color}; 
            transition: 0.3s all; }
    }

    .legend__label { 
        display: none;
        font-size: 1.2rem; 
        font-weight: ${props => props.selected ? 700 : 400};
        color: ${colors.rddarkgray}; 
        user-select: none;
        transition: 0.3s all;
        @media screen and (min-width: ${breakpoints.tablet}) { display: block; }
    }
`;

const Legend = (props) => {
    const context = React.useContext(AppContext);

    const renderLegendItems = () => {
        return legendItems.map((legendItem, index) => {
            const { statusColor, statusEnum, statusLabel, statusIcon } = legendItem;

            return (
                <StyledLegendItem
                    key={index}
                    color={statusColor}
                    selected={context.filters.status.includes(statusEnum)}
                    onClick={() => {
                        let statusFilters = context.filters.status;
                        if (statusFilters.includes(statusEnum)) {
                            statusFilters = statusFilters.filter(status => (status !== statusEnum));
                        } else {
                            statusFilters.push(statusEnum);
                        }

                        const activeFilters = context.setFilters({ status: statusFilters });
                        props.fetchServices(activeFilters);
                    }}
                >
                    <div className="legend__indicator" dangerouslySetInnerHTML={{ __html: statusIcon }}></div>
                    <div className="legend__label">{statusLabel}</div>
                </StyledLegendItem>
            )
        });
    }

    return (
        <StyledLegend>
            {renderLegendItems()}
        </StyledLegend>
    );
};

export default Legend;