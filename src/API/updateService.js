export default ({ token, inputValues, id }) => {
    return new Promise( async (resolve, reject) =>  {
        let url = `https://radiant-crag-38285.herokuapp.com/services/${id}`;

        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(inputValues)
        });

        if (response.status === 200) {
            const service = await response.json();
            resolve(service);
        } else {
            const error = await response.text();
            reject(error);
        }
    })

}