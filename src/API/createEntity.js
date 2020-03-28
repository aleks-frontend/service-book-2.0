export default ({ entityName, entityData, token }) => {
    return new Promise( async (resolve, reject) =>  {
        let url = `https://radiant-crag-38285.herokuapp.com/${entityName}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(entityData)
        });

        if (response.status === 200) {
            resolve();
        } else {
            const error = await response.text();
            reject(error);
        }
    })

}