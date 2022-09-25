import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";

/**
 * A history hash token that represents a label mapping delete
 */
export default class SpreadsheetLabelMappingDeleteHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    // /label/$label/delete
    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHash.DELETE;
    }

    spreadsheetLabelMappingWidgetExecute(widget, previousLabel) {
        widget.deleteLabelMapping(this.label());

        return null;
    }
}