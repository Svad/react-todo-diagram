/**
 * Created by Вадим on 02.12.2014.
 */

var React = require('react'),
    Reflux = require('reflux'),
    config = require('../config'),
    LayoutStore = require('../stores/LayoutStore'),
    ComponentDescription = require('../ComponentDescription'),

    LayoutActions = require('../actions').treeLayout,

    NodeCollapser = require('./NodeCollapser.react'),
    Diagonal = require('./Diagonal.react');

var ComponentNode = React.createClass({
    mixins: [Reflux.listenTo(LayoutStore, "onLayoutChange")],
    propTypes: {
        componentDescriptor: React.PropTypes.objectOf(ComponentDescription)
    },
    getInitialState: function () {
        return {x: -1e3, y: -1e3, collapsed: false};
    },
    getChildrenNodes: function () {
        var children = [],
            child,
            i = 0;

        while (child = this.refs['child' + i++]) {
            children.push(child);
        }

        return children;
    },
    getHeaderBBox: function () {
        return this.refs.header.getDOMNode().getBBox();
    },
    onLayoutChange: function () {
        var position = LayoutStore.getNodePosition(this);
        this.setState({x: position.x, y: position.y});
    },
    onCollapseChange: function (isCollapsed) {
        this.setState({collapsed: isCollapsed}, function () {
            LayoutActions.updateLayout();
        });
    },
    render: function () {

        var children = this.state.collapsed ? [] : this.props.componentDescriptor.children.map(function (child, i) {
            return <ComponentNode componentDescriptor={child} key={i} ref={'child' + i}></ComponentNode>;
        }.bind(this));

        var diagonals = children.map(function (child, i) {
            return <Diagonal endNode={child} startNode={this} key={i}/>
        }.bind(this));

        var nodeCollapser = <NodeCollapser onChange={this.onCollapseChange} show={!!this.props.componentDescriptor.children.length}/>;

        return (
            <g transform={"translate(" + this.state.x + " " + this.state.y + ")"}>
                <text ref="header" style={{fontSize: config.diagram.node.height}}>
                    {nodeCollapser}
                    <tspan className="title">{this.props.componentDescriptor.name}</tspan>
                </text>
                {children}
                {diagonals}
            </g>
        );
    }
});

module.exports = ComponentNode;