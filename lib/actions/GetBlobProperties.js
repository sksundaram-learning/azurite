'use strict';

const storageManager = require('./../StorageManager'),
    N = require('./../model/HttpHeaderNames'),
    LeaseStatus = require('./../Constants').LeaseStatus;

class GetBlobProperties {
    constructor() {
    }

    process(request, res) {
        storageManager.getBlobProperties(request)
            .then((response) => {
                response.addHttpProperty(N.ACCEPT_RANGES, 'bytes');
                response.addHttpProperty(N.REQUEST_SERVER_ENCRYPTED, false);
                response.addHttpProperty(N.LEASE_STATUS, ([LeaseStatus.AVAILABLE, LeaseStatus.BROKEN, LeaseStatus.EXPIRED].includes(response.proxy.original.leaseState)) ? 'unlocked' : 'locked');
                response.addHttpProperty(N.LEASE_STATE, response.proxy.original.leaseState);
                if (response.httpProps[N.LEASE_STATE] === LeaseStatus.LEASED) {
                    response.addHttpProperty(N.LEASE_DURATION, (response.proxy.original.leaseDuration === -1) ? 'infinite' : 'fixed');
                }
                response.addHttpProperty(N.CONTENT_TYPE, response.proxy.original.contentType);
                response.addHttpProperty(N.CONTENT_MD5, response.proxy.original.md5);
                response.addHttpProperty(N.CONTENT_LANGUAGE, response.proxy.original.contentLanguage);
                response.addHttpProperty(N.CONTENT_ENCODING, response.proxy.original.contentEncoding);
                response.addHttpProperty(N.CONTENT_DISPOSITION, response.proxy.original.contentDisposition);
                response.addHttpProperty(N.CACHE_CONTROL, response.proxy.original.cacheControl);
                response.addHttpProperty(N.BLOB_TYPE, response.proxy.original.entityType);
                response.addHttpProperty(N.CONTENT_LENGTH, response.proxy.original.size);
                res.set(response.httpProps);
                res.status(200).send();
            });
    }
}

module.exports = new GetBlobProperties();