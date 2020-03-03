import React from 'react';
import styled from 'styled-components';

const colors = {
    silver: '#C4C4C4',
    cornflowerBlue: '#7972FC'
}

const StyledForm = styled.form`
    margin: 20px 0;
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
        border: 1px solid ${colors.silver};
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
        background: ${colors.cornflowerBlue};
        border-radius: 2px;
    }
`;

export default StyledForm;