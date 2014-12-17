var React = require('react'),
    Reflux = require('reflux'),
    LayoutStore = require('../stores/LayoutStore'),
    config = require('../config'),
    format = require('util').format,

    ComponentNode = require('./ComponentNode.react');

var Diagonal = React.createClass({
    mixins: [Reflux.listenTo(LayoutStore, "onLayoutChange")],
    propTypes: {
        startNode: React.PropTypes.instanceOf(ComponentNode.constructor),
        endNode: React.PropTypes.instanceOf(ComponentNode.constructor)
    },
    getInitialState: function () {
        return {
            endNodePosition: {x: 0, y: 0},
            startNodeHeaderBBox: {width: 0, height: 0}
        }
    },
    onLayoutChange: function () {
        this.setState({endNodePosition: LayoutStore.getNodePosition(this.props.endNode)});
        this.setState({startNodeHeaderBBox: this.props.startNode.getHeaderBBox()})
    },
    render: function () {
        var halfHeight = this.state.startNodeHeaderBBox.height / 2 ,
            halfDistanceX = this.state.startNodeHeaderBBox.width + (this.state.endNodePosition.x - this.state.startNodeHeaderBBox.width) / 2;

        // Polyline like this:
        // <>---|
        //      |
        //      |--- <>

        var points = format('%d,%d %d,%d %d,%d %d,%d',
            this.state.startNodeHeaderBBox.width +3, -halfHeight,
            halfDistanceX, -halfHeight,
            halfDistanceX, this.state.endNodePosition.y - halfHeight,
            this.state.endNodePosition.x - 3, this.state.endNodePosition.y - halfHeight
        );

        return <polyline stroke="black" fill="none" points={points}/>
    }
});
module.exports = Diagonal;