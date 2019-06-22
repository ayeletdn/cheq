// TODO: FIX Error handling for errors from server (none-json)


const get = table => {
    return fetch('/'+ table)
    .then(handleJSONResponse)
    .catch(handleFailure);
}

const post = (table, body) => {
    return fetch('/' + table, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(handleJSONResponse)
    .catch(handleFailure);
}

const deleteRow = (table, id) => {
    return fetch('/' + table + '/' + id, {
        method: 'DELETE',
    })
    .then(handleJSONResponse)
    .catch(handleFailure);
}

const put = (table, body) => {
    const id = body.id;
    return fetch('/' + table + '/' + id, {
        method: 'PUT',
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json'
        },
    })
    .then(handleJSONResponse)
    .catch(handleFailure);

}

const handleJSONResponse = (response, reason) => {
    if (reason) {
        return Promise.reject(reason);
    }
    if (response.status !== 200) {
        return Promise.reject(`Request completed with status code ${response.status}`);
    }

    return response.json();
}

const handleFailure = reason => {
    console.error(`Could not complete action: ${reason}`);
    return Promise.reject(reason);
}

export default {get, post, put, deleteRow};