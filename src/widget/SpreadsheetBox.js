import React from 'react';
import PropTypes from "prop-types";

/**
 * This Box that includes accepts a callback that will receive the width and height of this component when mounted
 */
export default class SpreadsheetBox extends React.Component {

    constructor(props) {
        super(props);
        this.children = props.children;
        this.dimensions = props.dimensions;
    }

    componentDidMount() {
        const element = this.element;

        this.dimensions({
            width: (element && element.offsetWidth) | 0,
            height: (element && element.offsetHeight) | 0
        });
    }

    render() {
        return (
            <div
                style={{width: "100%", margin: 0, border: 0, padding: 0}}
                ref={element => this.element = element}
            >
                {this.children}
            </div>
        );
    }
}

SpreadsheetBox.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    dimensions: PropTypes.func.isRequired,
}