import React from 'react';
import styled from 'styled-components';

import { colors } from '../../helpers';

const StatusBoxContainer = styled.div`
    display: flex;
    flex: 1;
`;

const StatusBoxSidebar = styled.div`
    flex-basis:40%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13rem;
    color: ${ colors.rdgray};
`;

const StatusBoxMain = styled.div`
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
`;

const StatusBoxFrame = styled.div`
    display: flex;
    flex-direction: column;
    width: 80%;
    height: 60%;
    border: 0.1rem solid ${ colors.rdgray2};
    border-radius: 0.3rem;
`;

const StatusBoxHeader = styled.div`
    padding: 0.5rem 0.9rem;
    font-size: 1.1rem;
    color: #fff;
    background: ${colors.rdgray2};
`;

const StatusBoxBody = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    overflow: hidden;
    background: #fff;
`;

const StatusBoxIcon = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 25%;
    height: 80%;
    margin: 0 0.5rem;

    svg {
        width: 100%;
        height: 100%;

        path { fill: ${ props => props.iconColor}; }        
    }
`;

const StatusBoxLabel = styled.div`
    margin: 0 0.5rem;
    color: ${ colors.rdgray};
    font-size: 1.1rem;
`;

const StatusBox = ({ statusEnum, svgIcon, label, iconColor, servicesCount }) => {
    return (
        <StatusBoxContainer>
            <StatusBoxSidebar>
                {servicesCount}
            </StatusBoxSidebar>
            <StatusBoxMain>
                <StatusBoxFrame>
                    <StatusBoxHeader>Status</StatusBoxHeader>
                    <StatusBoxBody>
                        <StatusBoxIcon
                            status={statusEnum}
                            iconColor={iconColor}
                            dangerouslySetInnerHTML={{ __html: svgIcon }}></StatusBoxIcon>
                        <StatusBoxLabel>{label}</StatusBoxLabel>
                    </StatusBoxBody>
                </StatusBoxFrame>
            </StatusBoxMain>
        </StatusBoxContainer>
    );
};

export default StatusBox;
