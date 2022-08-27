import PropTypes from 'prop-types';
import React from 'react';
import SpreadsheetHistoryAwareStateWidget from "../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetMessengerCrud from "../message/SpreadsheetMessengerCrud.js";
import SpreadsheetMetadata from "./SpreadsheetMetadata.js";

/**
 * An abstract widget that contains some SpreadsheetMetadata support methods.
 */
export default class SpreadsheetMetadataWidget extends SpreadsheetHistoryAwareStateWidget {

    init() {
    }

    componentDidMount() {
        super.componentDidMount();

        this.spreadsheetMetadataCrudRemover = this.props.spreadsheetMetadataCrud.addListener(this.onSpreadsheetMetadata.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.spreadsheetMetadataCrudRemover && this.spreadsheetMetadataCrudRemover();
        delete this.spreadsheetMetadataCrudRemover;
    }

    /**
     * Unconditionally loads the SpreadsheetMetadata again.
     */
    loadSpreadsheetMetadata(id) {
        console.log("loadSpreadsheetMetadata");

        if(id){
            const props = this.props;
            props.spreadsheetMetadataCrud.get(
                id,
                {},
                (message, error) => props.showError("Unable to load spreadsheet " + id, error)
            );
        }
    }

    /**
     * Performs a PATCH to save the current property and value to the server
     */
    patchSpreadsheetMetadataProperty(property, value) {
        const patch = {};

        if(SpreadsheetMetadata.isProperty(property)){
            patch[property] = value;
        }else {
            patch.style = {};
            patch.style[property] = value;
        }

        this.patchSpreadsheetMetadata(patch)
    }

    /**
     * Performs a PATCH to the server with the new SpreadsheetMetadata property
     */
    patchSpreadsheetMetadata(patch) {
        const {id} = this.state;

        this.props.spreadsheetMetadataCrud.patch(
            id,
            JSON.stringify(patch),
            this.props.showError
        );
    }
}

SpreadsheetMetadataWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetMetadataCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud).isRequired,
    showError: PropTypes.func.isRequired,
}