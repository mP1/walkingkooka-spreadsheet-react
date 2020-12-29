import PropTypes from "prop-types";
import React from 'react';

/**
 * This Box that includes accepts a callback that will receive the width and height of this component when mounted
 */
export default class SpreadsheetBox extends React.Component {

    constructor(props) {
        super(props);
        this.children = props.children;
        this.dimensions = props.dimensions;
        this.element = React.createRef();
    }

    componentDidMount() {
        this.fireResize();
    }

    fireResize() {
        const element = this.element.current;
        const width = (element && element.offsetWidth) | 0;
        const height = (element && element.offsetHeight) | 0;

        console.log("fireResize width: " + width + ", height: " + height);

        this.dimensions({
            width: width,
            height: height,
        });
    }

    render() {
        return (
            <div
                style={{width: "100%", margin: 0, border: 0, padding: 0}}
                ref={this.element}
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