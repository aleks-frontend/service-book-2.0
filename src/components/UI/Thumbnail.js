import React from 'react';
import styled from 'styled-components';

import { colors } from '../../helpers';

const ThumbnailMain = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
    min-height: ${props => props.minHeight ? props.minHeight : '0' };
    background: #fff;
    border-radius: 0.4rem;
    cursor: ${props => props.clickable ? 'pointer' : 'auto'};
`;

const ThumbnailHeader = styled.div`
    padding: 1rem;
    font-size: 2rem;
    color: #fff;
    background: ${colors.rdgray2};
`;

const ThumbnailBody = styled.div`
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${props => props.padding ? props.padding : '0'};
`

const Thumbnail = ({ header, padding, minHeight, children }) => {
    return (
        <ThumbnailMain minHeight={minHeight}>
            <ThumbnailHeader>{header}</ThumbnailHeader>
            <ThumbnailBody padding={padding}>
                {children}
            </ThumbnailBody>
        </ThumbnailMain>
    );
};

export default Thumbnail;
