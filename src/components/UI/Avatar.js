import React from 'react';
import styled from 'styled-components';

import { colors } from '../../helpers';
import { AppContext } from '../AppProvider';
import { Link } from 'react-router-dom';

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

const Avatar = () => {    
    const context = React.useContext(AppContext);
    
    return (
      <AvatarWrapper>
          <AvatarPhoto imgSrc={context.user.thumbnail} />
          <AvatarDropdown className="avatarDropdown">
              <Link to='/profile'>Profile</Link>
              <button onClick={() => context.setUserInfo({userStatus: 'logged-out', user: null})}>Log out</button>
          </AvatarDropdown>
      </AvatarWrapper>  
    );
};

export default Avatar;