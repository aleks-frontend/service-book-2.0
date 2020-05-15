import { endpointUrl } from '../helpers';

export default ({ token, query }) => {
    return new Promise(async (resolve, reject) => {
        let url = `${endpointUrl}/services?`;
        url += 'page=' + (query.page)
        url += '&per_page=' + (query.pageSize)
        url += '&search=' + (query.search)
        url += '&orderByColumn=' + (query.orderByColumn || 'date')
        url += '&orderDirection=' + (query.orderDirection || 'desc')
        url += '&status=' + (query.statusActiveFilters.join(',') || '');

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