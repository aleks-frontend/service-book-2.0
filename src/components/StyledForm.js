import React from 'react';
import styled from 'styled-components';

import { colors } from '../helpers';

const StyledForm = styled.form`
    width: 100%;
    max-width: 50rem;
    color: ${colors.rddarkgray};
    text-align: left;

    label {
        display: block;
        margin: 5px 0;
    }

    input {
        display: block;
        padding: 5px;
        width: 100%;
        height: 40px;
        border: 1px solid ${colors.rdlightgray};
        border-radius: 2px;
        box-sizing: border-box;
    }

    button {
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 30px;
        width: 100%;
        height: 40px;
        font-size: 15px;
        font-weight: bold;
        color: #fff;
        background: ${colors.rdblue};
        border-radius: 2px;
        border: none;
    }

    h1 {
        font-size: 2.4rem;
        margin: 0 0 3rem;
        text-align: center;
    }
`;

export const StyledFormWrapper = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
`;

export default StyledForm;