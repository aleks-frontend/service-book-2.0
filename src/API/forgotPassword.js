import { endpointUrl } from '../helpers';

export default async (email) => {
    const response = await fetch(`${endpointUrl}/users/forgotpass`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
    });

    const message = await response.text();
    return message;

}