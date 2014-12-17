/**
 * Created by Вадим on 01.12.2014.
 */
require('./../stores/LayoutStore');

var React = require('react'),
    Reflux = require('reflux'),

    ComponentsTreeStore = require('./../stores/ComponentsTreeStore'),
    LifecycleActions = require('./../actions').treeLayout;

var Node = require('./ComponentNode.react.js');

module.exports = React.createClass({
    mixins: [Reflux.connect(ComponentsTreeStore, 'root')],
    componentDidUpdate: function() {
        LifecycleActions.updateLayout(this.refs.root);
    },
    render: function () {
        if(!this.state.root) return <div>Loading</div>;
        return <Node componentDescriptor={this.state.root} ref="root"></Node>;
    }
});

