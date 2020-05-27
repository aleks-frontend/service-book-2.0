import React from 'react';
import styled from 'styled-components';

import { colors } from '../../helpers';

const ThumbnailMain = styled.div`
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
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

const Thumbnail = ({ header, padding, children }) => {
    return (
        <ThumbnailMain>
            <ThumbnailHeader>{header}</ThumbnailHeader>
            <ThumbnailBody padding={padding}>
                {children}
            </ThumbnailBody>
        </ThumbnailMain>
    );
};

export default Thumbnail;
