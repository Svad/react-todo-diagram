var React = require('react'),
    ReactComponent = require('react/lib/ReactComponent'),
    HostAppActions = require('./actions').hostAppActions,
    ComponentDescription = require('./ComponentDescription'),
    App = require('./components/App.react.js');
var config = require('./config');
var oldComponentConstruct = ReactComponent.Mixin.construct;

var componentsHash = window.ch = new Map;

module.exports = function () {
    ReactComponent.Mixin.construct = diggedConstructor;
};
var root;
function diggedConstructor() {
    oldComponentConstruct.apply(this, arguments);

    //root element
    if (!this._owner) {
        root = new ComponentDescription(this);
        componentsHash.set(this, root);

        this.componentDidMount = decorate(this.componentDidMount, this, function () {
            ReactComponent.Mixin.construct = oldComponentConstruct;
            HostAppActions.updateRoot(root);
            React.render(<App />, document.getElementById('container'));
        });

        this.componentWillUpdate = decorate(this.componentWillUpdate, this, function () {
            ReactComponent.Mixin.construct = diggedConstructor;
        });

        this.componentDidUpdate = decorate(this.componentDidUpdate, this, function () {
            ReactComponent.Mixin.construct = oldComponentConstruct;
            HostAppActions.updateRoot(root);
        });

    } else {
        var ownerDescription = componentsHash.get(this._owner),
            childDescription = new ComponentDescription(this);
        ownerDescription.children.push(childDescription);
        componentsHash.set(this, childDescription);
    }

    this.componentWillUnmount = decorate(this.componentWillUnmount, this, function () {
        var parentDescriptor = componentsHash.get(this._owner);
        if(parentDescriptor) {
            var parentChildren = parentDescriptor.children;
            parentChildren.splice(parentChildren.indexOf(componentsHash.get(this)), 1);
        }
        componentsHash.delete(this);
        HostAppActions.updateRoot(root);
    }.bind(this))
}

function decorate(func, context, cb) {
    var oldFunc = func;

    return function () {
        if (oldFunc)
            oldFunc.apply(context, arguments);
        cb();
    }
}

