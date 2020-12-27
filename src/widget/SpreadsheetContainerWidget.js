import React from 'react';
import PropTypes from "prop-types";

/**
 * A container without any special behaviour or properties.
 */
export default class SpreadsheetContainerWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            style: props.style,
        };
        this.children = props.children;
    }

    render() {
        console.log("render", this.state);

        return <div style={this.state.style}>
            {this.children}
        </div>;
    }
}

SpreadsheetContainerWidget.propTypes = {
    style: PropTypes.object.isRequired,
    children: PropTypes.node.isRequired,
}