import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../helpers';

const StyledTopBar = styled.div`
    margin: 0 0 2rem;
    width: 100%;    
    @media screen and (min-width: ${breakpoints.desktop}) {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
`;

const TopBar = (props) => {
    return (
        <StyledTopBar>
            {props.children}
        </StyledTopBar>
    );
};

export default TopBar;