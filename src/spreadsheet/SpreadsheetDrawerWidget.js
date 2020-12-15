import React from 'react';
import PropTypes from 'prop-types';
import Drawer from "@material-ui/core/Drawer";
import Toolbar from "@material-ui/core/Toolbar";

/**
 * The drawer appears holds all general settings and tools for a spreadsheet sheet.
 */
export default class SpreadsheetDrawerWidget extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            open: props.open
        };
        this.onClose = props.onClose;
        this.width = props.width;
    }

    render() {
        return <Drawer id={"settings-tools-drawer"}
                       anchor={"right"}
                       variant={"persistent"}
                       open={this.state.open}
                       modal={false}
                       onClose={this.onClose}
        >
            <Toolbar />
            <div style={{margin: 0, border: 0, padding: 0, width: this.width + "px"}}>
            </div>
        </Drawer>;
    }
}

SpreadsheetDrawerWidget.propTypes = {
    open: PropTypes.bool.isRequired, // open=true shows the drawer
    onClose: PropTypes.func.isRequired, // fired when the drawer is closed
    width: PropTypes.number.isRequired, // the width includes px of the drawer
}