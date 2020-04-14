export default ({ token, entityName, id }) => {
    return new Promise((resolve) => {
        let url = `https://radiant-crag-38285.herokuapp.com/${entityName}/${id}`;

        fetch(url, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
            }
        }
        )
            .then(response => response.json())
            .then(result => {
                resolve(result);
            })
    })
}  
