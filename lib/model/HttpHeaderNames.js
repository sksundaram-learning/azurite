'use strict';

module.exports = {
    ETAG: 'etag',
    LAST_MODIFIED: 'last-modified',
    CONTENT_LENGTH: 'content-length',
    CONTENT_TYPE: 'content-type',
    CONTENT_ENCODING: 'content-encoding',
    CONTENT_DISPOSITION: 'content-disposition',
    CACHE_CONTROL: 'cache-control',
    CONTENT_LANGUAGE: 'content-language',
    CONTENT_MD5: 'content-md5',
    BLOB_CONTENT_MD5: 'x-ms-blob-content-md5',
    RANGE: 'range',
    RANGE_GET_CONTENT_MD5: 'x-ms-range-get-content-md5',
    CONTENT_RANGE: 'content-range',
    ACCEPT_RANGES: 'accept-ranges',
    DELETE_SNAPSHOTS: 'x-ms-delete-snapshots',
    SNAPSHOT_DATE: 'x-ms-snapshot',
    LEASE_ID: 'x-ms-lease-id',
    LEASE_ACTION: 'x-ms-lease-action',
    LEASE_DURATION: 'x-ms-lease-duration',
    LEASE_BREAK_PERIOD: 'x-ms-lease-break-period',
    LEASE_TIME: 'x-ms-lease-time',
    PROPOSED_LEASE_ID: 'x-ms-proposed-lease-id',
    IF_MODFIFIED_SINCE: 'if-modified-since',
    IF_UNMODIFIED_SINCE: 'if-unmodified-since',
    IF_MATCH: 'if-match',
    IF_NONE_MATCH: 'if_none_match',
    BLOB_PUBLIC_ACCESS: 'x-ms-blob-public-access',
    BLOB_TYPE: 'x-ms-blob-type',
    REQUEST_SERVER_ENCRYPTED: 'x-ms-request-server-encrypted',
    LEASE_STATUS: 'x-ms-lease-status',
    LEASE_STATE: 'x-ms-lease-state',
    LEASE_DURATION: 'x-ms-lease-duration',

    // Append Blob specific attributes
    BLOB_CONDITION_MAX_SIZE: 'x-ms-blob-condition-maxsize',
    BLOB_COMMITTED_BLOCK_COUNT: 'x-ms-blob-committed-block-count',
    BLOB_CONDITION_APPENDPOS: 'x-ms-blob-condition-appendpos',
    BLOB_APPEND_OFFSET: 'x-ms-blob-append-offset',
    // Page Blob specific
    SEQUENCE_NUMBER: 'x-ms-blob-sequence-number',
    BLOB_CONTENT_LENGTH: 'x-ms-blob-content-length',
    PAGE_WRITE: 'x-ms-page-write',
    IF_SEQUENCE_NUMBER_LE: 'x-ms-if-sequence-number-le',
    IF_SEQUENCE_NUMBER_LT: 'x-ms-if-sequence-number-lt',
    IF_SEQUENCE_NUMBER_EQ: 'x-ms-if-sequence-number-eq',

    VERSION: 'x-ms-version',
    DATE: 'date',
    REQUEST_ID: 'x-ms-request-id'
};