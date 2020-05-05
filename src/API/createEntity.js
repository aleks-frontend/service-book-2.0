import { endpointUrl } from '../helpers';

export default ({ entityName, entityData, token }) => {
    return new Promise( async (resolve, reject) =>  {
        let url = `${endpointUrl}/${entityName}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entityData)
        });

        if (response.status === 200) {
            const entity = await response.json();
            resolve(entity);
        } else {
            const error = await response.text();
            reject(error);
        }
    })

}