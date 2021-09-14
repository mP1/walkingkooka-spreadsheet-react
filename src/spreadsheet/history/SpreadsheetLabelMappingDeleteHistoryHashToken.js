import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";

/**
 * A history hash token that represents a label mapping delete
 */
export default class SpreadsheetLabelMappingDeleteHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    /**
     * Singleton instance.
     */
    static INSTANCE = new SpreadsheetLabelMappingDeleteHistoryHashToken();

    constructor() {
        super();
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.DELETE;
    }

    labelMappingWidget(widget) {
        widget.deleteLabelMapping();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetLabelMappingDeleteHistoryHashToken);
    }
}