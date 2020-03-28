import React from 'react';
import styled from 'styled-components';

import { colors, widths, pageTitles } from '../../helpers';
import Avatar from './Avatar';
import { AppContext } from '../AppProvider';

const StyledHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2rem 2rem ${widths.sidebar};
    height: 8rem;
    color: ${colors.rdlightgray};
    font-size: 2.5rem;
    background-color: ${colors.rdgray};

    .logo { 
        height: 5rem;
        
        img { 
            height: 100%; 
            width: auto;
        }
    }
`;

const Header = (props) => {
    const context = React.useContext(AppContext);

    return (
        <StyledHeader>
            {pageTitles[context.activePage]}
            <Avatar />
        </StyledHeader>
    );
}

export default Header;
