import React from 'react';
import styled from 'styled-components';

import { breakpoints, zIndexes } from '../../helpers';

const HamburgerButtonMain = styled.div`
    position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    left: 2rem;
    top: -6rem;
    width: 4rem;
    height: 4rem;
    cursor: pointer;
    z-index: ${zIndexes.hamburgerButton};

    @media screen and (min-width: ${breakpoints.tablet}) {
        display: none;
    }
`;

const HamburgerButtonBar = styled.div`
    position: relative;
    width: 100%;
    height: 0.3rem;
    background: #fff;
    transition: all 0.3s;
    transform: ${props => props.animated ? 'rotate(135deg)' : 'rotate(0deg)'};
    user-select: none;

    &::after, &::before {
        content: '';
        position: absolute;
        width: inherit;
        height: inherit;
        background: inherit;
        top: ${props => props.animated ? '0' : '1rem'};
        transform: ${props => props.animated ? 'rotate(90deg)' : 'rotate(0deg)'};
    }

    &::before { top: ${props => props.animated ? '0' : '-1rem'} }
`;

const HamburgerButton = ({ sidebarVisibleOnMobile, toggleSidebarVisibleOnMobile }) => {

    return (
        <HamburgerButtonMain onClick={toggleSidebarVisibleOnMobile}>
            <HamburgerButtonBar animated={sidebarVisibleOnMobile} />
        </HamburgerButtonMain>
    );
};

export default HamburgerButton;
