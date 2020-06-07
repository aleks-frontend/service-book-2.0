import React from 'react';
import styled from 'styled-components';
import { withRouter } from 'react-router-dom';

import Button from './UI/Button';
import GeneralForm from './GeneralForm';

import { AppContext } from './AppProvider';

import { updateUser, getAppUser, appLogout, getAppToken } from '../auth';
import { colors, borderRadiuses } from '../helpers';

import fetchApi from '../fetchApi';


const ProfileWrapper = styled.div`
    overflow: hidden;
    width: 100%;
    max-width: 42rem;
    border-radius: ${borderRadiuses.medium};
`;

const ProfileHeader = styled.div`
    display: flex;
    padding: 1.3rem 1.3rem 1.5rem;
    background: ${colors.rdgray2};
`;

const ProfilePhoto = styled.img`
    flex-shrink: 0;
    width: 10rem;
    height: 10rem;
    background: url(${props => props.src});
    background-size: cover;
    border-radius: ${borderRadiuses.full};
`;

const ProfileText = styled.div`
    flex: 1;
    margin: 0.5rem 2rem;
    overflow: hidden;
`;

const ProfileInfo = styled.input`
    padding: ${props => props.readOnly ? '0' : '0.5rem'};
    font-size: ${props => props.readOnly ? '2rem' : '1.6rem'};
    color: ${props => props.readOnly ? '#fff' : colors.rddarkgray};
    background: ${props => props.readOnly ? 'transparent' : '#fff'};
    border: none;
`;

const ProfileBody = styled.div`
    padding: 1rem;
    background: #fff;
`;

const ProfileMessage = styled.div`
    display: flex;
    align-items: center;
    padding: 2rem;
    min-height: 20rem;
    font-size: 1.5rem;
    line-height: 1.4em;
    color: ${colors.rddarkgray};
    text-align: center;
`;

const Profile = (props) => {
    const context = React.useContext(AppContext);
    const user = getAppUser();

    const [state, setState] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmedPassword: '',
        name: user.name,
        editMode: false
    });

    React.useEffect(() => {
        context.setActivePage('profile');
    }, []);

    const handleInputChange = (name, event) => {
        setState({
            ...state,
            [name]: event.target.value
        })
    };

    const handleEditClick = async () => {
        if (state.editMode) {
            const updatedUser = (await fetchApi({
                url: `/users/${user._id}`,
                method: 'PUT',
                token: getAppToken(),
                body: {
                    name: state.name
                }
            })).data;

            updateUser(updatedUser);
        }

        setState({ ...state, editMode: !state.editMode });
    }

    const handleFormSubmit = async () => {
        const { currentPassword, newPassword: password, confirmedPassword } = state;

        if (password !== confirmedPassword) {
            alert('Confirmed password does not match the new password');
            return;
        }

        const response = await fetchApi({
            url: '/users/changepassword',
            method: 'POST',
            token: getAppToken(),
            body: {
                currentPassword,
                password
            }
        });

        context.showSnackbar(response.data);
        setState({
            ...state,
            currentPassword: '',
            newPassword: '',
            confirmedPassword: ''
        })
    };

    return (
        <ProfileWrapper>
            <ProfileHeader>
                <ProfilePhoto src={user.thumbnail} />
                <ProfileText>
                    <ProfileInfo
                        readOnly={!state.editMode}
                        type="text"
                        value={state.name}
                        onChange={(event) => handleInputChange('name', event)}
                    />
                    <Button
                        onClick={() => appLogout(props.history)}
                        margin="1rem auto"
                        dark={true}>
                        Log out
                    </Button>
                </ProfileText>
                {!user.isGoogleAccount &&
                    <Button
                        dark={true}
                        compact={true}
                        customWidth="6rem"
                        margin="0.5rem 0 0"
                        onClick={handleEditClick}>
                        {state.editMode ? 'Save' : 'Edit'}
                    </Button>}
            </ProfileHeader>
            <ProfileBody>
                {user.isGoogleAccount && <ProfileMessage>
                    You are currently logged in with your Google account, so user and password details can not be changed.
                </ProfileMessage>}
                {!user.isGoogleAccount && <GeneralForm
                    onSubmit={handleFormSubmit}
                    inputs={[
                        {
                            type: 'password',
                            value: state.currentPassword,
                            label: 'Current Password',
                            onChange: (event) => handleInputChange('currentPassword', event),
                        },
                        {
                            type: 'password',
                            value: state.newPassword,
                            label: 'New Password',
                            onChange: (event) => handleInputChange('newPassword', event),
                        },
                        {
                            type: 'password',
                            value: state.confirmedPassword,
                            label: 'Confirmed Password',
                            onChange: (event) => handleInputChange('confirmedPassword', event),
                        }
                    ]} />}
            </ProfileBody>
        </ProfileWrapper>
    );
};

export default withRouter(Profile);