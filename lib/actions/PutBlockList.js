'use strict';

const storageManager = require('./../StorageManager'),
    N = require('./../model/HttpHeaderNames'),
    AError = require('./../AzuriteError');

class PutBlockList {
    constructor() {
    }

    process(request, res) {
        storageManager.putBlockList(request)
            .then((response) => {
                response.addHttpProperty(N.CONTENT_MD5, request.calculateContentMd5());
                response.addHttpProperty(N.REQUEST_SERVER_ENCRYPTED, false);
                res.set(response.httpProps);
                res.status(201).send();
            });
    }
}

module.exports = new PutBlockList();