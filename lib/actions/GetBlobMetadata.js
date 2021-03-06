'use strict';

const storageManager = require('./../StorageManager');

class GetBlobMetadata {
    constructor() {
    }

    process(request, res) {
        storageManager.getBlobMetadata(request)
            .then((response) => {
                res.set(response.httpProps);
                res.status(200).send();
            });
    }
}

module.exports = new GetBlobMetadata();