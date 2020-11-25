import React from 'react';
import PropTypes from "prop-types";

const RESIZE = "resize";

/**
 * A container that updates its state with the new dimensions of the window.
 */
export default class WindowResizer extends React.Component {

    constructor(props) {
        super(props);
        this.children = props.children;
        this.dimensions = props.dimensions;
    }

    componentDidMount() {
        this.updateDimensions();
        window.addEventListener(RESIZE, this.updateDimensions.bind(this));
    }

    componentWillUnmount() {
        window.removeEventListener(RESIZE, this.updateDimensions);
    }

    /**
     * Update the state with the current window dimensions. This can be used to trigger a redraw of the children.
     */
    updateDimensions() {
        this.setState({
            width: window.innerWidth,
            height: window.innerHeight,
        });
    }

    render() {
        return (
            <div style={{width: "100%", margin: 0, border: 0, padding: 0}}>
                {this.children}
            </div>
        );
    }
}

WindowResizer.propTypes = {
    children: PropTypes.arrayOf(PropTypes.object).isRequired,
    dimensions: PropTypes.func.isRequired,
}