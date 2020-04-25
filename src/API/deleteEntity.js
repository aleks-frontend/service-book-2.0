export default ({ id, token, entityName }) => {
    return new Promise(async (resolve, reject) => {
        let url = `https://radiant-crag-38285.herokuapp.com/${entityName}/${id}`;

        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'x-auth-token': token,
            }
        });

        if (response.status === 200) {
            resolve();
        } else {
            const error = await response.text();
            reject(error);
        }
    })

}