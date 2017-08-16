'use strict';

const crypto = require('crypto'),
    N = require('./HttpHeaderNames'),
    EntityType = require('./../Constants').StorageEntityType,
    etag = require('./../utils'),
    InternalAzuriteError = require('./../InternalAzuriteError');

let _md5 = null;

function _parseEntityType(type) {
    if (typeof type === 'string') {
        switch (type) {
            case 'BlockBlob':
                return EntityType.BlockBlob;
            case 'AppendBlob':
                return EntityType.AppendBlob;
            case 'PageBlob':
                return EntityType.PageBlob;
            default:
                return "";
        }
    }
    return type;
}

class AzuriteRequest {
    constructor({
        req = null,
        entityType = "",
        usage = null }) {

        if (req === null) {
            throw new InternalAzuriteError('AzuriteRequest: req cannot be null!');
        }

        // this.containerName = req.params.container;
        // this.blobName = req.params[0];
        this.httpProps = {};
        this.metaProps = {};
        this.body = req.body;
        this.entityType = _parseEntityType(entityType);
        this.usage = usage;
        this.query = req.query;
        this._initMetaProps(req.rawHeaders);
        this._initHttpProps(req.headers);
    }

    calculateContentMd5() {
        if (!this.body) {
            throw new InternalAzuriteError('Request: MD5 calculation without initialized body.');
        }
        if (!_md5) {
            _md5 = crypto.createHash('md5')
                .update(this.body)
                .digest('base64');
        }
        return _md5;
    }

    leaseId() {
        return this.httpProps[N.LEASE_ID];
    }

    // Working on rawHeaders for meta attributes to preserve casing.
    _initMetaProps(rawHeaders) {
        this.metaProps = rawHeaders.map((e, i, a) => {
            if (e.indexOf('x-ms-meta-') !== -1) {
                e = e.replace('x-ms-meta-', '');
                const o = {};
                o[e] = a[i + 1];
                return o;
            }
        }).filter((e) => {
            return e !== undefined;
        }).reduce((acc, e) => {
            const key = Object.keys(e)[0];
            acc[key] = e[key];
            return acc;
        }, {});
    }

    _initHttpProps(httpHeaders) {
        this.httpProps[N.CONTENT_LENGTH] = httpHeaders['Content-Length'] || httpHeaders['content-length'];
        // x-ms-* attributes have precedence over according HTTP-Headers
        this.httpProps[N.CONTENT_TYPE] = httpHeaders['x-ms-blob-content-Type'] || httpHeaders['content-type'] || 'application/octet-stream';
        this.httpProps[N.CONTENT_ENCODING] = httpHeaders['x-ms-blob-content-encoding'] || httpHeaders['content-encoding'];
        this.httpProps[N.CONTENT_DISPOSITION] = httpHeaders['x-ms-blob-content-disposition'] || httpHeaders['content-disposition'];
        this.httpProps[N.CACHE_CONTROL] = httpHeaders['x-ms-blob-cache-control'] || httpHeaders['cache-control'];
        this.httpProps[N.CONTENT_LANGUAGE] = httpHeaders['x-ms-blob-content-language'] || httpHeaders['content-language'];
        this.httpProps[N.CONTENT_MD5] = httpHeaders['x-ms-blob-content-md5'] || httpHeaders['content-md5'];
        this.httpProps[N.RANGE] = httpHeaders['x-ms-range'] || httpHeaders['range'];

        this.httpProps[N.BLOB_TYPE] = httpHeaders['x-ms-blob-type']
        this.httpProps[N.RANGE_GET_CONTENT_MD5] = httpHeaders['x-ms-range-get-content-md5'];
        this.httpProps[N.DELETE_SNAPSHOTS] = httpHeaders['x-ms-delete-snapshots'];
        this.httpProps[N.LEASE_ID] = httpHeaders['x-ms-lease-id'];
        this.httpProps[N.LEASE_ACTION] = httpHeaders['x-ms-lease-action'];
        this.httpProps[N.LEASE_DURATION] = httpHeaders['x-ms-lease-duration'];
        this.httpProps[N.LEASE_BREAK_PERIOD] = httpHeaders['x-ms-lease-break-period'];
        this.httpProps[N.PROPOSED_LEASE_ID] = httpHeaders['x-ms-proposed-lease-id'];
        this.httpProps[N.IF_MODFIFIED_SINCE] = httpHeaders['if-modified-since'];
        this.httpProps[N.IF_UNMODIFIED_SINCE] = httpHeaders['if-unmodified-since'];
        this.httpProps[N.IF_MATCH] = httpHeaders['if-match'];
        this.httpProps[N.IF_NONE_MATCH] = httpHeaders['if-none-match'];
        // As per spec @ https://docs.microsoft.com/en-us/rest/api/storageservices/set-container-acl 
        // if this header is not specified it is set to 'private' per default.
        this.httpProps[N.BLOB_PUBLIC_ACCESS] = httpHeader['x-ms-blob-public-access'] || 'private';
        // Append Blobs specific
        this.httpProps[N.BLOB_CONDITION_MAX_SIZE] = parseInt(httpHeaders['x-ms-blob-condition-maxsize']) || undefined;
        this.httpProps[N.BLOB_CONDITION_APPENDPOS] = parseInt(httpHeaders['x-ms-blob-condition-appendpos']) || undefined;
        // Page Blobs specific 
        this.httpProps[N.BLOB_CONTENT_LENGTH] = httpHeader['x-ms-blob-content-length'];
        this.httpProps[N.PAGE_WRITE] = httpHeader['x-ms-page-write'];
        this.httpProps[N.IF_SEQUENCE_NUMBER_LE] = httpHeader['x-ms-if-sequence-number-le'];
        this.httpProps[N.IF_SEQUENCE_NUMBER_LT] = httpHeader['x-ms-if-sequence-number-lt'];
        this.httpProps[N.IF_SEQUENCE_NUMBER_EQ] = httpHeader['x-ms-if-sequence-number-eq'];

        Object.keys(this.httpProps).forEach((key) => {
            if (this.httpProps[key] === undefined) {
                delete this.httpProps[key];
            }
        });
    }
}

module.exports = AzuriteRequest;