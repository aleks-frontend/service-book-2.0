export default ({ afterUpdate, beforeUpdate, token, entityName }) => {
    return new Promise( async (resolve, reject) =>  {
        delete afterUpdate._id;
        delete afterUpdate.__v;

        let url = `https://radiant-crag-38285.herokuapp.com/${entityName}/${beforeUpdate._id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(afterUpdate)
        });

        if (response.status === 200) {
            resolve();
        } else {
            const error = await response.text();
            reject(error);
        }
    })

}