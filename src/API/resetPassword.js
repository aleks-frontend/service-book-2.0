import { endpointUrl } from '../helpers';

export default async ({ token, currentPassword, password }) => {
    const response = await fetch(`${endpointUrl}/users/changepassword`, {
        method: 'POST',
        headers: {
            'x-auth-token': token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
            currentPassword,
            password
        })
    });

    const message = await response.text();
    return message;
}