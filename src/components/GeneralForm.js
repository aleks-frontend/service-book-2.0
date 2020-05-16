import React from 'react';
import styled from 'styled-components';

import Button from './UI/Button';

import { colors, borderRadiuses } from '../helpers';

const GeneralFormWrapper = styled.div`
    overflow: hidden;
    border: 0.2rem solid ${colors.rdgray2};
    border-radius: ${borderRadiuses.big};
`;

const GeneralFormHeader = styled.div`
    padding: 1rem;
    background: ${colors.rdgray2};
`;

const GeneralFormBody = styled.div`
    padding: 1rem;
    background: #fff;
`;

const GeneralFormHeading = styled.h2`
    font-size: 1.8rem;
    color: #fff;
    font-weight: 400;
    margin: 0;
`;

const GeneralFormLabel = styled.label`
    display: block;
    font-size: 1.4rem;
    line-height: 1.2em;
`;

const GeneralFormInput = styled.input`
    display: block;
    padding: 0.2rem;
    margin: 0.5rem 0 1rem;
    width: 100%;
    height: 3.5rem;
    border: 0.2rem solid ${colors.rddarkgray};
`;

const GeneralForm = (props) => {
    return (
        <GeneralFormWrapper>
            <GeneralFormHeader>
                <GeneralFormHeading>Change Password</GeneralFormHeading>
            </GeneralFormHeader>
            <GeneralFormBody>
                {props.inputs.map((input, index) => {
                    return (
                        <React.Fragment key={index}>
                            <GeneralFormLabel>{input.label}</GeneralFormLabel>
                            <GeneralFormInput 
                                type={input.type}
                                value={input.value}
                                onChange={input.onChange}
                            />
                        </React.Fragment>
                    );
                })}
                <Button
                    compact={true}
                    dark={true}
                    onClick={props.onSubmit}>Submit</Button>
            </GeneralFormBody>
        </GeneralFormWrapper>
    );
};

export default GeneralForm;
