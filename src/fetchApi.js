import { endpointUrl } from './helpers';

/**
 * @param url - backend endpoint that will be called, e.g. /auth/validate
 * @param method - http request method GET / POST / PUT / DELETE
 * @param token - backend token (optional)
 * @param body - body object with additional inputs (optional)
 * @param async - flag for request being executed asynchronously, true by default
 * @returns promise with fetched data
*/
export default async ({ url, method, token, body }) => {
    //add endpoint base url
    url = endpointUrl + url;

    //init configs 
    const fetchConfigs = {
        method,
        credentials: 'include'
    };

    //set headers
    if (token || body) {
        fetchConfigs.headers = {};

        if (token) fetchConfigs.headers['x-auth-token'] = token;
        if (body) fetchConfigs.headers['Content-Type'] = 'application/json';
    }

    //set body
    if (body) fetchConfigs.body = JSON.stringify(body);

    const response = await fetch(url, fetchConfigs);
    
    //get result based on the response type, can be json or text
    const contentType = response.headers.get("content-type");
    let resultData;    
    if (contentType && contentType.indexOf("application/json") !== -1) {
        resultData = await response.json();
    } else {
        resultData = await response.text();     
    }

    return {
        data: resultData,
        status: response.status
    }
}