import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { AppContext } from '../AppProvider';
import { colors, breakpoints } from '../../helpers';
import { svgIcons } from '../../helpers';

const StyledNav = styled.div`
    .nav__item {        
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        padding: 1.5rem 0 1.5rem 2rem;
        color: ${colors.rdlightgray};
        text-decoration: none;
        transition: 0.3s all;

        @media screen and (min-width: ${breakpoints.tablet}) {
            flex-direction: column;
            justify-content: center;
            padding: 1.5rem 0;
        }

        &:hover { 
            cursor: pointer; 
            color: ${colors.rdblue};

            svg path, 
            svg polygon, 
            svg ellipse,
            svg line,
            svg rect { stroke: ${colors.rdblue}; }
        }

        &--active { 
            color: ${colors.rdblue}; 

            svg path, 
            svg polygon, 
            svg ellipse,
            svg line,
            svg rect { stroke: ${colors.rdblue}; }
        }

        svg path, 
        svg polygon,
        svg ellipse,
        svg line,
        svg rect { transition: 0.3s all; }
    }

    .nav__icon { 
        margin: 0 2rem 0 0;
        width: 3.5rem; 

        @media screen and (min-width: ${breakpoints.tablet}) {
            margin: 0 0 0.5rem;            
        }
        
        svg { width: 100%; }
    }

    .nav__text {
        font-size: 2rem;
        font-weight: 400;
        text-align: center;
        text-decoration: none;

        @media screen and (min-width: ${breakpoints.tablet}) {
            font-size: 1.1rem;
            font-weight: 700;
        }
    }
`;

const navItems = {
    home: {
        text: "Home",
        icon: svgIcons.home,
        path: '/'
    },
    newService: {
        text: "New Service",
        icon: svgIcons.newService,
        path: '/new-service'
    },
    history: {
        text: "History",
        icon: svgIcons.history,
        path: '/history'
    },
    customers: {
        text: "Customers",
        icon: svgIcons.customers,
        path: '/customers'
    },
    actions: {
        text: "Actions",
        icon: svgIcons.actions,
        path: '/actions'
    },
    devices: {
        text: "Devices",
        icon: svgIcons.devices,
        path: '/devices'
    }
};

const Nav = ({ toggleSidebarVisibleOnMobile }) => {
    const context = React.useContext(AppContext);

    return (
        <StyledNav>
            {Object.keys(navItems).map((key) => (
                <Link
                    className={(context.activePage === key) ? 'nav__item nav__item--active' : 'nav__item'}
                    key={key}
                    onClick={() => {
                        toggleSidebarVisibleOnMobile();
                        context.setActivePage(key)
                    }}
                    to={navItems[key].path}
                >
                    <div className="nav__icon" dangerouslySetInnerHTML={{ __html: navItems[key].icon }}></div>
                    <div className="nav__text">{navItems[key].text}</div>
                </Link>
            )
            )}
        </StyledNav>
    );
}

export default Nav;
