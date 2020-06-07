import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../helpers';

const StyledGrid = styled.div`
    display: grid;
    grid-template-columns: 1fr;
	grid-auto-rows: ${props => `${props.rowSize}rem`};
	grid-gap: ${props => `${props.gapSize}rem`};
    width: 100%;

    @media screen and (min-width: ${breakpoints.tablet}) { 
        grid-template-columns: ${props => `repeat(auto-fill, minmax(${props.columnSize}rem, 1fr))`};
    }
`;

const GridBasic = (props) => {
    return (
        <StyledGrid
            columnSize={props.columnSize}
            rowSize={props.rowSize}
            gapSize={props.gapSize}
        >
            {props.children}
        </StyledGrid>
    );
};

GridBasic.defaultProps = {
    columnSize: 35,
    rowSize: 38,
    gapSize: 2
}

export default GridBasic;