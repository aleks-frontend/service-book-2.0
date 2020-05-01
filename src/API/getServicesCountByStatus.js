export default ({ token, status }) => {
    return new Promise((resolve) => {
        let url = 'https://radiant-crag-38285.herokuapp.com/reports/serviceCount';

        fetch(url, {
            method: 'POST',
            headers: {
                'x-auth-token': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({status})
        }
        )
            .then(response => response.text())
            .then(result => {
                resolve(result)
            })
    })
}  
