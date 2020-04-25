export default ({ token, entityName, id, async = true }) => {
    const url = `https://radiant-crag-38285.herokuapp.com/${entityName}/${id}`;

    if ( async ) {
        return new Promise((resolve) => {
    
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
    } else {
        // Used only for the PDF Printing
        const request = new XMLHttpRequest();
        request.open('GET', url, false);  // `false` makes the request synchronous
        request.send(null);
        
        if (request.status === 200) {
          return JSON.parse(request.responseText);
        }        
    }
}  
