function ComponentDescription(component) {
    this.children = [];
    this.component = component;
    Object.defineProperty(this, 'name', {
        value: this.component.constructor.displayName

    })
}

module.exports = ComponentDescription;