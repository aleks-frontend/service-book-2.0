import React from 'react';
import ServiceCard from './ServiceCard';
import { StyledGridItem } from './styled-components/styledGrid';

import { statusEnum } from '../helpers';

const LastModifiedServices = (props) => {    
    return props.services.map((service, index) => {        
        return (
            <StyledGridItem key={index}>
                <ServiceCard
                    key={service.id}
                    id={service.id}
                    service={service}
                    compact={true}
                    deleteService={() => props.deleteService({reload: true, id: service._id})}
                    updateService={(updatedService) => {
                        return props.updateService({ 
                            reload: updatedService.status === statusEnum.SHIPPED, 
                            service: updatedService 
                        })
                    }}
                    printService={props.printService}
                />
            </StyledGridItem>
        )
    })
};

export default LastModifiedServices;
