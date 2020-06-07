import React from 'react';
import styled from 'styled-components';

import { zIndexes, breakpoints } from '../../helpers';

const StyledCreateEntityButton = styled.button`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 2rem;
    padding: 0 2rem;
    height: 4rem;
    color: #fff;
    background: #313442;
    border: 1px solid black;
    border-radius: 0.5rem;
    user-select: none;

    @media screen and (min-width: ${breakpoints.tablet}) { 
        ${props => {
            if ( props.injectIntoTable ) {
                return `transform: translate(1rem, calc(100% + 1rem));
                z-index: ${zIndexes.materialUICreateButton};`
            }
        }};

        margin: 0;
    }

    &:hover { cursor: pointer; }
    &:focus { outline: none; }    

    &::before {
        content: '';
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 1rem;
        width: 2.2rem;
        height: 2.2rem;
        font-size: 1.6rem;
        line-height: 2.1em;
        background: url('./img/plus-icon-white.png');
        background-size: 100% 100%; }
`;

const CreateEntityButton = (props) => {
    return (
        <StyledCreateEntityButton 
            onClick={props.showPopup}
            injectIntoTable={props.injectIntoTable}
        >Create {props.entity}
        </StyledCreateEntityButton>
    );
};

export default CreateEntityButton;