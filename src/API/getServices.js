export default ({ token, query }) => {
    return new Promise(async (resolve, reject) => {
        let url = `https://radiant-crag-38285.herokuapp.com/services?`;
        url += 'page=' + (query.page)
        url += '&search=' + (query.search)
        url += '&orderByColumn=' + (query.orderByColumn || 'date')
        url += '&orderDirection=' + (query.orderDirection || 'desc');

        fetch(url, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
            }
        })
            .then(response => response.json())
            .then(result => {
                resolve(result);
            })
            .catch(err => reject(err));
    })

}