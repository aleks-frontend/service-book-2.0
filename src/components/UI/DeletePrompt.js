import React from 'react';
import styled from 'styled-components';

import Button from './Button';
import { colors, zIndexes } from '../../helpers';

const DeletePromptText = styled.div`
    margin-bottom: 2rem; 
    color: ${colors.rddarkgray};
`;

const DeletePromptButtons = styled.div`
    display: flex;
`;

const DeletePrompt = ({ okCallback, cancelCallback }) => {
    return (
        <React.Fragment>
            <DeletePromptText>Are you sure you want to delete this service?</DeletePromptText>
            <DeletePromptButtons>
                <Button
                    onClick={okCallback}
                    type="button"
                    margin="0 0.5rem"
                >Yes
                    </Button>
                <Button
                    onClick={cancelCallback}
                    isText={true}
                    type="button"
                    margin="0 0.5rem"
                >No
                    </Button>
            </DeletePromptButtons>
        </React.Fragment>
    );
};

export default DeletePrompt;
