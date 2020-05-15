import React from 'react';
import styled from 'styled-components';

import Button from './UI/Button';
import GeneralForm from './GeneralForm';

import { AppContext } from './AppProvider';
import { getAppUser } from '../auth';
import { colors, borderRadiuses } from '../helpers';

import resetPasswordAPI from '../API/resetPassword';

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

const ProfilePhoto = styled.div`
    width: 10rem;
    height: 10rem;
    background: url(${props => props.src});
    background-size: cover;
    border-radius: ${borderRadiuses.full};
`;

const ProfileText = styled.div`
    flex: 1;
    margin: 0.5rem 2rem;
`;

const ProfileInfo = styled.div`
    font-size: ${props => props.secondary ? '1.5rem' : '2rem'};
    color: ${props => props.secondary ? colors.rdlightgray : '#fff'};
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

const Profile = () => {
    const context = React.useContext(AppContext);
    const user = getAppUser();

    const [state, setState] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmedPassword: ''
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

    const handleFormSubmit = async () => {
        const { currentPassword, newPassword: password, confirmedPassword } = state;

        if (password !== confirmedPassword) {
            alert('Confirmed password does not match the new password');
            return;
        }

        const message = await resetPasswordAPI({
            token: context.token,
            currentPassword,
            password
        });

        context.showSnackbar(message);
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
                    <ProfileInfo>{user.name}</ProfileInfo>
                    <ProfileInfo secondary={true}>Some title</ProfileInfo>
                </ProfileText>
                {!user.isGoogleAccount && <Button dark={true} compact={true}>Edit</Button>}
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

export default Profile;