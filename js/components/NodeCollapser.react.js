var React = require('react');

var NodeCollapser = React.createClass({
    propTypes: {
        onClick: React.PropTypes.func,
        show: React.PropTypes.bool
    },
    getInitialState: function () {
        return {
            collapsed: false
        }
    },
    onClick: function (e) {
        e.preventDefault();

        this.setState({collapsed: !this.state.collapsed}, function () {
            if (this.props.onChange) {
                this.props.onChange(this.state.collapsed);
            }
        })

    },
    render: function () {
        var symbol = this.state.collapsed ? '►' : '▼';
        return <a href="#" className="node-collapse" onClick={this.onClick} style={{display: this.props.show ? '' : 'none'}}>{symbol}</a>
    }
});

module.exports = NodeCollapser;