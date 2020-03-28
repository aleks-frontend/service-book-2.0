import React from 'react';
import styled from 'styled-components';

import { colors } from '../../helpers'

const ContentMain = styled.div`
    flex: 1;
    padding: 2rem;
    background: ${colors.rdlightgray};
`;

const Content = (props) => {
    return (
        <ContentMain>
            {props.children}
        </ContentMain>
    );
};

export default Content;