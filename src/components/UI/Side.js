import React from 'react';
import styled from 'styled-components';

import HamburgerButton from './HamburgerButton';
import Nav from './Nav';

import { colors, widths, heights, zIndexes, breakpoints } from '../../helpers';

const SideMain = styled.div`
    position: fixed;
    flex-shrink: 0;
    left: 0;
    top: 0;
    bottom: 0;
    padding-top: ${heights.header};
    width: 100%;
    color: #fff;
    background: ${colors.rdgray};
    text-align: center;
    transition: all 0.3s;
    transform: ${props => props.sidebarVisibleOnMobile ? 'translateX(0)' : 'translateX(-100%)'};
    z-index: ${zIndexes.side};

    @media screen and (min-width: ${breakpoints.tablet}) {
        position: relative !important;
        padding-top: 0;
        width: ${widths.sidebar};
        transform: translateX(0) !important;
    }
`;

const Side = () => {
    const [ state, setState ] = React.useState({
        sidebarVisibleOnMobile: false,
    });

    const toggleSidebarVisibleOnMobile = () => {
        setState({
            ...state,
            sidebarVisibleOnMobile: !state.sidebarVisibleOnMobile
        })
    };

    return (
        <React.Fragment>
            <HamburgerButton 
                toggleSidebarVisibleOnMobile={toggleSidebarVisibleOnMobile}
                sidebarVisibleOnMobile={state.sidebarVisibleOnMobile} 
            />
            <SideMain sidebarVisibleOnMobile={state.sidebarVisibleOnMobile}>
                <Nav toggleSidebarVisibleOnMobile={toggleSidebarVisibleOnMobile} />
            </SideMain>
        </React.Fragment>
    );
};

export default Side;