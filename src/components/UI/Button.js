import React from 'react';
import styled from 'styled-components';

import { colors, breakpoints } from '../../helpers';

const StyledButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    margin: ${props => props.margin ? props.margin : '0'};
    padding: ${props => props.customWidth ? '0' : (props.compact ? '0 1rem' : '0 1.5rem')};
    width: ${props => props.customWidth ? props.customWidth : 'auto' };
    height: ${props => props.compact ? '2.5rem' : '3rem'};
    color: ${props => props.isText ? colors.rdgray2 : '#fff'};
    background: ${props => props.isText ? 'transparent' : (props.dark ? colors.rddarkgray : colors.rdgray2)};
    border: none;
    border-radius: 0.3rem;
    box-shadow: ${props => props.isText ? 'none' : '0px 2px 4px rgba(0, 0, 0, 0.25)'}; 

    @media screen and ( min-width: ${breakpoints.tablet} ) { 
        padding: ${props => props.customWidth ? '0' : (props.compact ? '0 2rem' : '0 3.5rem')};
    }

    &:hover { cursor: pointer; }
    &:focus { outline: none; }
    &:disabled { 
        opacity: 0.8;
        cursor: default; }

    a { 
        color: ${props => props.isText ? colors.rdgray2 : '#fff'}; 
        text-decoration: none; }
`;

const Button = ({ isText, onClick, compact, margin, customWidth, disabled, dark, type, children }) => {    
    return (
        <StyledButton
            isText={isText}
            onClick={onClick}
            compact={compact}
            margin={margin}
            customWidth={customWidth}
            disabled={disabled}
            dark={dark}
            type={type}
        >
            {children}
        </StyledButton>
    );
};

export default Button;
