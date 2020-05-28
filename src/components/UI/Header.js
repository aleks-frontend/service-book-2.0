import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { colors, widths, pageTitles } from '../../helpers';
import Avatar from './Avatar';
import Logo from './Logo';
import { AppContext } from '../AppProvider';

const HeaderMain = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 2rem 2rem 2rem ${widths.sidebar};
    height: 8rem;
    color: ${colors.rdlightgray};
    font-size: 2.5rem;
    background-color: ${colors.rdgray};
`;

const HeaderLeft = styled(Link)`
    position: absolute;
    left: 2rem;
    top: 2rem;
`;

const Header = () => {
    const context = React.useContext(AppContext);

    return (
        <HeaderMain>
            <HeaderLeft
                onClick={(e) => context.setActivePage('home')}
                to="/"
            >
                <Logo />
            </HeaderLeft>
            {pageTitles[context.activePage]}
            <Avatar />
        </HeaderMain>
    );
}

export default Header;
