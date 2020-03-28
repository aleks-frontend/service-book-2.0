import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

import { AppContext } from '../AppProvider';
import { colors } from '../../helpers';
import { svgIcons } from '../../helpers';

const StyledNav = styled.div`    
    .nav__item {        
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 1.5rem 0;
        color: ${colors.rdlightgray};
        text-decoration: none;
        transition: 0.3s all;
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
        margin-bottom: 0.5rem;
        width: 3.5rem; 
        
        svg { width: 100%; }
    }

    .nav__text {
        font-size: 1.1rem;
        font-weight: 700;        
        text-align: center;
        text-decoration: none;
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

const Nav = () => {
    const context = React.useContext(AppContext);

    return (
        <StyledNav>
            {Object.keys(navItems).map((key) => (
                <Link
                    className={(context.activePage === key) ? 'nav__item nav__item--active' : 'nav__item'}
                    key={key}
                    onClick={(e) => context.setActivePage(key)}
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
