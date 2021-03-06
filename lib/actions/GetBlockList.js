'use strict';

const storageManager = require('./../StorageManager'),
    N = require('./../model/HttpHeaderNames'),
    js2xmlparser = require('js2xmlparser'),
    Model = require('./../xml/BlockListXmlModel');


class GetBlockList {
    constructor() {
    }

    process(request, res) {
        storageManager.getBlockList(request)
            .then((response) => {
                const xml = this._transformToXml(response.payload, request.blockListType);
                response.addHttpProperty(N.BLOB_CONTENT_LENGTH, response.proxy.original.size);
                response.addHttpProperty(N.CONTENT_TYPE, 'application/xml');
                // TODO: CHeck whether content-length must be explicitly set to length of xml as value is set to 0 by default
                res.status(200).send(xml);
            });
    }

    _transformToXml(blockList, blockListType) {
        let model = new Model.BlockList(blockListType);
        for (let block of blockList) {
            if (block.committed && (blockListType === 'committed' || blockListType === 'all')) {
                model.committedblocks.block.push(new Model.Block(block.blockId, block.size));
            } else if (!block.committed && (blockListType === 'uncommitted' || blockListType === 'all')) {
                model.uncommittedblocks.block.push(new Model.Block(block.blockId, block.size));
            }
        }
        return js2xmlparser.parse('blocklist', model);
    }
}

module.exports = new GetBlockList();