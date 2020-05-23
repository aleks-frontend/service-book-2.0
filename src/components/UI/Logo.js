import React from 'react';
import styled from 'styled-components';

const LogoMain = styled.img`
    position: absolute;
    left: 2rem;
    top: 2rem;
    width: 4.5rem;
`;

const Logo = () => <LogoMain src="/img/header-logo.svg" />;

export default Logo;
