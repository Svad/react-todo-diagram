var Reflux = require('reflux'),
    config = require('../config'),
    LifecycleActions = require('../actions').treeLayout,
    _rootNode,
    layout = new Map;

module.exports = Reflux.createStore({
    listenables: [LifecycleActions],
    onUpdateLayout: function (rootNode) {
        if(!rootNode) {
            rootNode = _rootNode;
        } else {
            _rootNode = rootNode;
        }

        layout.clear();
        layout.set(rootNode.props.componentDescriptor, config.diagram.root.position);
        this.buildLayout(rootNode, rootNode.getHeaderBBox().width);
        this.trigger();
    },
    buildLayout: function (node, parentLevelWidth) {
        var nodePosition = layout.get(node.props.componentDescriptor),
            children = node.getChildrenNodes();

        if (!children.length) {
            return nodePosition.y
        }

        var childrenMaxWidth = -1,
            brotherY = -config.diagram.node.fullHeight;

        //we need to find max children header width and pass it to children layout building
        children.forEach(function (child) {
            childrenMaxWidth = Math.max(child.getHeaderBBox().width, childrenMaxWidth)
        });

        children.forEach(function (child) {
            layout.set(child.props.componentDescriptor, {
                x: parentLevelWidth + config.diagram.node.marginLeft,
                y: brotherY + config.diagram.node.fullHeight
            });
            brotherY = this.buildLayout(child, childrenMaxWidth);
        }.bind(this));

        return brotherY + nodePosition.y;
    },
    getNodePosition: function (component) {
        return layout.get(component.props.componentDescriptor);
    }
});