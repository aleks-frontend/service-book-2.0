import React from 'react';
import styled from 'styled-components';

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
    padding: 1rem;
    min-width: 12rem;
    background: #fff;
    text-align: center;
    border: 1px solid ${colors.rddarkgray};
    border-radius: 0.3rem;

    a {
        display: block;
        padding: 0.5em;
        font-size: 1.2rem;
        color: ${colors.rddarkgray};
        text-decoration: none;
        border-bottom: 0.1rem solid ${colors.rddarkgray};
    }
`;

const Avatar = (props) => {            
    const user = getAppUser();
    
    return (      
      <AvatarWrapper>
          <AvatarPhoto imgSrc={user && user.thumbnail} />
          <AvatarDropdown className="avatarDropdown">
              <Link to='/profile'>Profile</Link>
              <button onClick={() => {
                  appLogout(props.history);
              }}>Log out</button>
          </AvatarDropdown>
      </AvatarWrapper>
    );
};

export default withRouter(Avatar);