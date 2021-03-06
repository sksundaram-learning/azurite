'use strict';

const storageManager = require('./../StorageManager'),
    LeaseStatus = require('./../Constants').LeaseStatus,
    N = require('./../model/HttpHeaderNames'),
    js2xmlparser = require("js2xmlparser"),
    model = require('./../xml/BlobListXmlModel');

class ListBlobs {
    constructor() {
    }

    process(request, res) {
        const query = {
            prefix: request.query.prefix || '',
            delimiter: (request.query.delimiter) ? true : false,
            marker: request.query.marker || 0,
            maxresults: request.query.maxresults || 5000,
            include: request.query.include
        }
        storageManager.listBlobs(request, query)
            .then((response) => {
                response.addHttpProperty(N.CONTENT_TYPE, 'application/xml');
                const transformedModel = this._transformBlobList(response.payload, query);
                let xmlDoc = js2xmlparser.parse('EnumerationResults', transformedModel);
                xmlDoc = xmlDoc.replace(`<EnumerationResults>`, `<EnumerationResults ServiceEndpoint="http://localhost:10000/devstoreaccount1" ContainerName="${request.containerName}">`);
                xmlDoc = xmlDoc.replace(/\>[\s]+\</g, '><');
                res.set(response.httpProps);
                res.status(200).send(xmlDoc);
            });
    }

    _transformBlobList(blobList, query) {
        let xmlBlobListModel = new model.BlobList();
        (query.prefix === undefined) ? delete xmlBlobListModel.Prefix : xmlBlobListModel.Prefix = query.prefix;
        (query.maxresults === undefined) ? delete xmlBlobListModel.MaxResults : xmlBlobListModel.MaxResults = query.maxresults;
        (query.marker === undefined) ? delete xmlBlobListModel.Marker : xmlBlobListModel.Marker = query.marker;
        for (const blob of blobList) {
            let modelBlob = new model.Blob(blob.original.name, blob.original.blobType);
            xmlBlobListModel.Blobs.Blob.push(modelBlob);
            if (query.include !== 'metadata') {
                delete modelBlob.Metadata;
            } else {
                this._addMetadata(modelBlob, blob.original.metaProps);
            }
            modelBlob.Properties['Last-Modified'] = blob.lastModified();
            modelBlob.Properties['Etag'] = blob.original.etag
            modelBlob.Properties['Content-Type'] = blob.original.contentType ? blob.original.contentType : {};
            modelBlob.Properties['Content-Encoding'] = blob.original.contentEncoding ? blob.original.contentEncoding : {};
            modelBlob.Properties['Content-MD5'] = blob.original.md5 ? blob.original.md5 : {};
            modelBlob.Properties['Content-Length'] = blob.original.size;
            modelBlob.Properties['Cache-Control'] = blob.original.cacheControl ? blob.original.cacheControl : {};
            modelBlob.Properties['Content-Language'] = blob.original.contentLanguage ? blob.original.contentLanguage : {};
            modelBlob.Properties['Content-Disposition'] = blob.original.contentDisposition ? blob.original.contentDisposition : {};
            modelBlob.Properties.BlobType = blob.original.entityType;
            modelBlob.Properties['x-ms-blob-sequence-number'] = blob.original.sequenceNumber ? blob.original.sequenceNumber : {};
            modelBlob.Properties.LeaseStatus = ([LeaseStatus.AVAILABLE, LeaseStatus.BROKEN, LeaseStatus.EXPIRED].includes(blob.original.leaseState)) ? 'unlocked' : 'locked';
            modelBlob.Properties.LeaseState = blob.original.leaseState;
            if (blob.original.leaseState === LeaseStatus.LEASED) {
                modelBlob.Properties.LeaseDuration = (blob.original.leaseDuration === -1) ? 'infinite' : 'fixed';
            } else {
                delete modelBlob.Properties.LeaseDuration;
            }
        }
        return xmlBlobListModel;
    }

    _addMetadata(blobModel, metaProps) {
        Object.keys(metaProps).forEach((key) => {
            let value = metaProps[key];
            key = key.replace('x-ms-meta-', '');
            blobModel.Metadata[key] = value;
        });
    }
}

module.exports = new ListBlobs();