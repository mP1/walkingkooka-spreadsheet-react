import Preconditions from "../../../Preconditions.js";
import PropTypes from 'prop-types';
import SpreadsheetExpressionReference from "../SpreadsheetExpressionReference.js";
import SpreadsheetFormula from "./formula/SpreadsheetFormula.js";
import SpreadsheetHistoryAwareStateWidget from "../../history/SpreadsheetHistoryAwareStateWidget.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetMessengerCrud from "../../message/SpreadsheetMessengerCrud.js";
import SystemObject from "../../../SystemObject.js";

/**
 * An abstract widget that contains some cell related helper methods..
 */
export default class SpreadsheetCellWidget extends SpreadsheetHistoryAwareStateWidget {

    componentDidMount() {
        super.componentDidMount();

        this.onSpreadsheetDeltaRemover = this.props.spreadsheetDeltaCellCrud.addListener(this.onSpreadsheetDelta.bind(this));
    }

    componentWillUnmount() {
        super.componentWillUnmount();

        this.onSpreadsheetDeltaRemover && this.onSpreadsheetDeltaRemover();
        delete this.onSpreadsheetDeltaRemover;
    }

    onSpreadsheetDelta(method, cellOrLabel, url, requestDelta, responseDelta) {
        SystemObject.throwUnsupportedOperation();
    }

    /**
     * Calls the server to PATCH a cell and also handles updating the history hash leaving just the selection.
     */
    patchFormula(cellOrLabel, formulaText) {
        Preconditions.requireInstance(cellOrLabel, SpreadsheetExpressionReference, "cellOrLabel");

        const cells = {}
        cells[cellOrLabel.toString()] = {
            "formula": new SpreadsheetFormula(formulaText).toJson()
        };

        this.patch(
            cellOrLabel,
            {
                "cells" : cells,
            }
        );
    }

    /**
     * {
     *     style: {
     *         text-align: "LEFT"
     *     }
     * }
     */
    patchStyle(selection, stylePropertyName, stylePropertyValue) {
        Preconditions.requireNonNull(selection, "selection");
        Preconditions.requireNonNull(stylePropertyName, "stylePropertyName");

        const style = {};
        style[stylePropertyName] = stylePropertyValue ?
            stylePropertyValue.toJson ?
                stylePropertyValue.toJson() :
                stylePropertyValue :
            stylePropertyValue;

        this.patch(
            selection,
            {
                "style": style
            }
        )
    }

    patch(selection, delta) {
        Preconditions.requireNonNull(selection, "selection");
        Preconditions.requireNonNull(delta, "delta");

        const props = this.props;
        props.spreadsheetDeltaCellCrud.patch(
            selection,
            delta,
            this.unknownLabelErrorHandler(props.showError),
        );
    }
}

SpreadsheetCellWidget.propTypes = {
    history: PropTypes.instanceOf(SpreadsheetHistoryHash).isRequired,
    spreadsheetDeltaCellCrud: PropTypes.instanceOf(SpreadsheetMessengerCrud),
    showError: PropTypes.func.isRequired,
}