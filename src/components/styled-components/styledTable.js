import styled from 'styled-components';

import { colors } from '../../helpers';

export const StyledTable = styled.div`
    display: grid;
    grid-template-columns: 1fr minmax(5rem, 10rem) minmax(5rem, 10rem);
    grid-gap: 0.5rem;
    padding: 1.5rem 2.5rem 1.5rem 1.5rem;
    width: 100%;
    border: 1px solid ${colors.lightgray};
    border-radius: 0.4rem;

    .headerBg {
        background: ${colors.dpgray};
        grid-row: 1;
        grid-column: 1 / -1;
        border-radius: 0.3rem; }

    .footer {
        grid-column: 1 / -1;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        padding-top: 0.5rem;

        .button {
            border: none;
            display: flex;
            align-items: center;
            height: 3rem;
            padding: 0 3.5rem;
            color: #fff;
            background: ${colors.dpblue};
            border-radius: 0.3rem;
            text-transform: uppercase;
            box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.25); 
            
            &:hover { cursor: pointer; }
        }

        .total { font-weight: 700; }
    }
`;

export const StyledTableCell = styled.div`
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    grid-row: ${props => props.header ? '1' : 'auto'};
    grid-column: ${props => props.header ? props.col : 'auto'};
    justify-content: ${props => (props.header && props.col === 1) ? 'flex-start' : 'center'};
    padding: 0.8rem 1rem;
    font-size: 1.2rem;
    font-weight: ${props => props.header ? '700' : '400'};
    color: ${props => props.header ? '#fff' : '#000'};
    background: ${props => props.header ? 'transparent' : '#fff'};
    border: ${props => props.header ? 'none' : props.alerted ? '1px solid red' : `1px solid ${colors.lightgray}`};
    border-radius: 0.3rem;
    text-align: ${props => (props.col === 1) ? 'left' : 'center'};

    input[type="number"] {
        max-width: 100%;
        height: 3.4rem;
        border: none; }

    .closex {
        position: absolute;
        padding: 0 0.5rem;
        right: 0;
        font-size: 1.5rem;
        font-weight: 700;
        transform: translateX(100%);
        opacity: 0;
        transition: 0.3s all;

        &:hover { cursor: pointer; }
    }

    &:hover .closex { opacity: 1; }
    
`;