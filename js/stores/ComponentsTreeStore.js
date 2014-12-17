var Reflux = require('reflux'),
    hostAppActions = require('../actions').hostAppActions,
    componentsTreeRoot;

module.exports = Reflux.createStore({
    listenables: [hostAppActions],
    onUpdateRoot: function (tree) {
        componentsTreeRoot = tree;
        this.trigger(tree);
    },
    getRoot: function () {
        return componentsTreeRoot;
    }
});
