import React from 'react';
import styled from 'styled-components';

import { AppContext } from '../AppProvider';
import { statusEnum, colors, svgIcons } from '../../helpers';

const StyledLegend = styled.div`
    display: flex;
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
        width: 3.3rem;
        height: 3.3rem; 
        padding: ${props => props.selected ? '0.3rem' : '0'};
        border: ${props => props.selected ? `0.1rem solid ${colors.rddarkgray}` : 'none'};
        border-radius: ${props => props.selected ? '50%' : '0'};
        transition: 0.3s all;
    
        svg path { 
            fill: ${props => props.color}; 
            transition: 0.3s all; }
    }

    .legend__label { 
        font-size: 1.2rem; 
        font-weight: ${props => props.selected ? 700 : 400};
        color: ${colors.rddarkgray}; 
        user-select: none;
        transition: 0.3s all; }
`;

const Legend = () => {    
    const context = React.useContext(AppContext);

    return (
        <StyledLegend>
            <StyledLegendItem 
                colors={colors}
                color={colors.yellow}
                selected={context.statusActiveFilters.includes(statusEnum.RECEIVED)}
                onClick={() => context.setStatusActiveFilters({ values: [statusEnum.RECEIVED] })}>
                <div className="legend__indicator" dangerouslySetInnerHTML={{ __html: svgIcons.received }}></div>
                <div className="legend__label">Received</div>
            </StyledLegendItem>
            <StyledLegendItem 
                colors={colors}
                color={colors.orange}
                selected={context.statusActiveFilters.includes(statusEnum.INPROGRESS)}
                onClick={() => context.setStatusActiveFilters({ values: [statusEnum.INPROGRESS] })}>
                <div className="legend__indicator" dangerouslySetInnerHTML={{ __html: svgIcons.inProgress }}></div>
                <div className="legend__label">In Progress</div>
            </StyledLegendItem>
            <StyledLegendItem 
                colors={colors}
                color={colors.green}
                selected={context.statusActiveFilters.includes(statusEnum.COMPLETED)}
                onClick={() => context.setStatusActiveFilters({ values: [statusEnum.COMPLETED] })}>
                <div className="legend__indicator" dangerouslySetInnerHTML={{ __html: svgIcons.completed }}></div>
                <div className="legend__label">Completed</div>
            </StyledLegendItem>
            <StyledLegendItem 
                colors={colors}
                color={colors.blue}
                selected={context.statusActiveFilters.includes(statusEnum.SHIPPED)}
                onClick={() => context.setStatusActiveFilters({ values: [statusEnum.SHIPPED] })}>
                <div className="legend__indicator" dangerouslySetInnerHTML={{ __html: svgIcons.shipped }}></div>
                <div className="legend__label">Shipped</div>
            </StyledLegendItem>
        </StyledLegend>
    );
};

export default Legend;