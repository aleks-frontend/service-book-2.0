export default (token) => {
    return new Promise((resolve) => {
        let url = 'https://radiant-crag-38285.herokuapp.com/reports/earningsPerMonth';

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
