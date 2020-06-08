import React from 'react';
import styled from 'styled-components';

import { colors, svgIcons } from '../../helpers';

const StyledSpinner = styled.div`
    position: absolute;
    display: inline-block;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);  
    width: 8rem;
    height: 8rem;

    div {
        position: absolute;
        opacity: 1;
        animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
    }

    @keyframes lds-ripple {
        0% {
            top: 3.6rem;
            left: 3.6rem;
            width: 0;
            height: 0;
            opacity: 1;
        }
        100% {
            top: 0;
            left: 0;
            width: 7.2rem;
            height: 7.2rem;
            opacity: 0;
        }
    }    
`;

const LoadingSpinner = () => {
    return (
        <StyledSpinner>
            {/* <div></div> */}
            <div dangerouslySetInnerHTML={{ __html: svgIcons.loadingSpinner }}></div>
            {/* <div dangerouslySetInnerHTML={{ __html: svgIcons.loadingSpinner }}></div> */}
        </StyledSpinner>
    );
}

export default LoadingSpinner;