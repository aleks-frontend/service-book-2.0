import React from 'react';
import styled from 'styled-components';

import { breakpoints } from '../../helpers';

export const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 20rem 20rem;
  grid-auto-rows: 30rem;
  grid-gap: 2rem;
  width: 100%;
  max-width: 100%;

  @media screen and ( min-width: ${breakpoints.tablet} ) { grid-template-columns: repeat(2, 1fr); }
  @media screen and ( min-width: ${breakpoints.desktop} ) { grid-template-columns: repeat(4, 1fr); }
`;

export const StyledGridItem = styled.div`
    overflow: hidden;
    @media screen and ( min-width: ${breakpoints.tablet} ) { 
        grid-column: ${props => props.gridColumnTablet ? props.gridColumnTablet : 'auto'};
        grid-row: ${props => props.gridRowTablet ? props.gridRowTablet : 'auto'};
    }

    @media screen and ( min-width: ${breakpoints.desktop} ) { 
        grid-column: ${props => props.gridColumnDesktop ? props.gridColumnDesktop : 'auto'};
        grid-row: ${props => props.gridRowDesktop ? props.gridRowDesktop : 'auto'};
    }
`;
