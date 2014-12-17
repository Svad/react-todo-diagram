var Reflux = require('reflux');

module.exports = {
    hostAppActions: Reflux.createActions(['updateRoot']),

    treeLayout: Reflux.createActions(['updateLayout'])
};
