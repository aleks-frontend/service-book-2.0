import { endpointUrl } from '../helpers';

export default (token) => {
    return new Promise((resolve) => {
        let url = `${endpointUrl}/reports/earningsPerMonth`;

        fetch(url, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
            }
        }
        )
            .then(response => response.json())
            .then(result => {
                resolve(result)
            })
    })
}  
