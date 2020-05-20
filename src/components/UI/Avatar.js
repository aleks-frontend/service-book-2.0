import React from 'react';
import styled from 'styled-components';

import Button from './Button';

import { colors } from '../../helpers';
import { Link, withRouter } from 'react-router-dom';

import { appLogout, getAppUser } from '../../auth';

const AvatarWrapper = styled.div`
    position: relative;

    &:hover > .avatarDropdown { display: block; }
`;

const AvatarPhoto = styled.div`
    width: 4rem;
    height: 4rem;
    border-radius: 50%;
    background: url(${props => props.imgSrc});
    background-size: cover;
`;

const AvatarDropdown = styled.div`
    display: none;
    position: absolute;
    top: 4rem;
    right: 0;
    padding: 0;
    min-width: 12rem;
    background: #fff;
    text-align: center;
    border: 0.2rem solid ${colors.rdgray2};
    border-radius: 0.2rem;

    a {
        display: block;
        padding: 0.9em;
        font-size: 1.1rem;
        color: #fff;
        text-decoration: none;
        background: ${colors.rdgray2};
    }
`;

const Avatar = (props) => {            
    const user = getAppUser();
    
    return (      
      <AvatarWrapper>
          <AvatarPhoto imgSrc={user && user.thumbnail} />
          <AvatarDropdown className="avatarDropdown">
              <Link to='/profile'>Profile</Link>              
              <Button 
                onClick={() => appLogout(props.history)}
                margin="1rem auto"                
                >Log out</Button>
          </AvatarDropdown>
      </AvatarWrapper>
    );
};

export default withRouter(Avatar);