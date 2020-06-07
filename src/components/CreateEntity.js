import React from 'react';
import styled from 'styled-components';

import Button from './UI/Button';
import { colors, breakpoints } from '../helpers';

import { AppContext } from './AppProvider';
import fetchApi from '../fetchApi';
import { getAppToken } from '../auth';

const StyledCreateEntity = styled.div`
    position: relative;
    padding: 1.5rem 1.5rem 2.5rem;
    width: 80rem;
    max-width: 100%;
    background: ${colors.lightgray2};
    border-radius: 0.4rem;

    .group {
        border: 1px solid transparent;
        margin-bottom: 0.5rem;

        label { 
            display: block;
            padding: 0.5rem 0.3rem;
            line-height: 1.2em;
            color: #fff;
            background: ${colors.rdgray2};
            border-top-left-radius: 4px; 
            border-top-right-radius: 4px;            
        }

        input[type="text"], textarea {
            display: block;
            width: 100%;
            padding: 0 0.5rem;
            height: 3.8rem;
            border: none;
            border-bottom-left-radius: 4px; 
            border-bottom-right-radius: 4px; 
            
            &:focus { outline: none; }
            &.empty-required {
                background: rgba(255,0,0, 0.5); }

            &:read-only {
                color: gray;
                background-color: #e3e3e3;
                border-color: gray;

                &:hover {
                    cursor: default; }
            }
        }

        textarea { height: 6rem; } 

        select {
            width: 100%;
            height: 3rem; }

        &.empty-required { 
            color: red;
            border-color: red; }

        .select { 
            flex: 1; 
            border: none; }
    }

    .footer { margin-top: 1rem; }
`;

const CreateEntity = (props) => {
    const context = React.useContext(AppContext);
    /** Preseting defaultState Object **/
    const defaultState = {};
    for (const field of props.fields) {
        defaultState[field.name] = '';

        if (field.defaultVal) {
            defaultState[field.name] = props.presetVal;
        }
    }

    /** Setting up the real state **/
    const [state, setState] = React.useState({
        entityState: { ...defaultState },
        emptyRequiredInputs: {}
    });

    /** Event Handler Methods **/
    const handleInputChange = (event) => {
        const entityStateCopy = { ...state.entityState };
        for (const field of props.fields) {
            if (field.calculated && field.calculated.indexOf(event.target.name) > -1) {
                const str = field.calculated.map(item => {
                    if (item === 'serial') {
                        if (item === event.target.name) {
                            return event.target.value !== '' ? `(sn: ${event.target.value})` : '';
                        } else {
                            return entityStateCopy[item] !== '' ? `(sn: ${entityStateCopy[item]})` : '';
                        }
                    } else {
                        return item === event.target.name ? event.target.value : entityStateCopy[item];
                    }
                }).join(' ');

                entityStateCopy[field.name] = str;
            }
        }

        entityStateCopy[event.target.name] = event.target.value;
        setState({ ...state, entityState: entityStateCopy });
    }

    const handleFormSubmit = async (event) => {
        event.preventDefault();
        const emptyRequiredInputs = {};
        let newEntity = {};

        // Checking for empty required fields
        for (const field of props.fields) {
            if (field.required) {
                const isEmptyString = state.entityState[field.name] === '';

                if (isEmptyString) {
                    emptyRequiredInputs[field.name] = 'empty-required';
                } else if (emptyRequiredInputs.hasOwnProperty(field.name)) {
                    delete emptyRequiredInputs[field.name];
                }
            }
        }

        setState({ ...state, emptyRequiredInputs: { ...emptyRequiredInputs } });
        if (Object.keys(emptyRequiredInputs).length) {
            context.showSnackbar('Required field(s) missing');
            return;
        }

        // Checking if this a regular CreateEntity component 
        // (not the case when we are calling it from NewService)
        try {
            const response = await fetchApi({ 
                url: '/' + (props.endpointName || props.stateName),
                method: 'POST',
                token: getAppToken(),
                body: state.entityState
            });

            if (response.status === 200) {
                newEntity = response.data;
                context.showSnackbar(`new ${props.entityLabel.toLowerCase()} was created successfully (${state.entityState.name})`);
            } else {
                context.showSnackbar(response.data);
            }            
            
            if (props.isDirect) {
                props.hidePopup();
            } else {
                props.addEntityToLocalState({ 
                    entity: state.entityState, 
                    stateKey: props.stateName, 
                    isMulti: props.isMulti, 
                    id: newEntity._id
                });
            }
        } catch (err) {
            context.showSnackbar(err);
        }

    }

    React.useEffect(() => {
        for (const field of props.fields) {
            defaultState[field.name] = field.defaultVal ? props.presetVal : '';
        }

        setState({ ...state, entityState: { ...defaultState } })
    }, [props.presetVal]);

    return (
        <StyledCreateEntity onClick={(e) => e.stopPropagation()}>
            {props.fields.map(field => (
                <div className="group" key={field.name}>
                    <label>{field.required && '* '}{field.label}</label>
                    <input
                        type="text"
                        name={field.name}
                        readOnly={field.calculated ? true : false}
                        required={field.required}
                        autoFocus={field.autoFocus}
                        value={state.entityState[field.name]}
                        onChange={handleInputChange}
                        className={state.emptyRequiredInputs[field.name] ? state.emptyRequiredInputs[field.name] : ''}
                    />
                </div>
            ))}
            <div className="footer">
                <Button
                    type="submit"
                    onClick={handleFormSubmit}
                >Create</Button>
                <Button
                    type="button"
                    onClick={props.hidePopup}
                    isText={true}
                >Cancel</Button>
            </div>
        </StyledCreateEntity>
    );
};

export default CreateEntity;