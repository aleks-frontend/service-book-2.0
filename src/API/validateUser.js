import { endpointUrl } from '../helpers';

export default async (token) => {
    const response = await fetch(`${endpointUrl}/users/me`, {
        method: 'GET',
        headers: {
            'x-auth-token': token,
        }
    });

    if (response.status === 200) {
        const user = await response.json();
        return {
            error: false,
            data: user
        };        
    } else {
        const errorText = await response.text();
        return {
            error: true,
            data: errorText
        };        
    }
}   
