export default ({ serviceData, token }) => {
    return new Promise( async (resolve, reject) =>  {
        let url = `https://radiant-crag-38285.herokuapp.com/services`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(serviceData)
        });

        if (response.status === 200) {
            const result = await response.json();
            resolve(result);
        } else {
            const error = await response.text();
            reject(error);
        }
    })

}