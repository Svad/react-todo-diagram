var config = {
    diagram: {
        root: {
            position: {x: 20, y: 20}
        },
        node: {
            height: 20,
            marginTop: 10,
            marginLeft: 30,
            get fullHeight() {
                return config.diagram.node.marginTop + config.diagram.node.height
            }
        }
    }
};

module.exports = config;
