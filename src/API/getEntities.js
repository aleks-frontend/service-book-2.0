export default ({ query, token, entityName }) => {
    return new Promise((resolve) => {
        let url = `https://radiant-crag-38285.herokuapp.com/${entityName}?`
        url += 'per_page=' + query.pageSize
        url += '&page=' + (query.page)
        url += '&search=' + (query.search)
        url += '&orderByColumn=' + (query.orderBy ? query.orderBy.field : '')
        url += '&orderDirection=' + (query.orderDirection);

        fetch(url, {
            method: 'GET',
            headers: {
                'x-auth-token': token,
            }
        }
        )
            .then(response => response.json())
            .then(result => {
                resolve({
                    data: result.data,
                    page: result.page,
                    totalCount: result.totalCount,
                })
            })
    })
}  
