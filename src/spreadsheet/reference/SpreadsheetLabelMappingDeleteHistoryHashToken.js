import Preconditions from "../../Preconditions.js";
import SpreadsheetHistoryHash from "../history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

/**
 * A history hash token that represents a label mapping delete
 */
export default class SpreadsheetLabelMappingDeleteHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    constructor(label) {
        super();

        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");

        this.labelValue = label;
    }

    label() {
        return this.labelValue;
    }

    // /label/$label/delete
    toHistoryHashToken() {
        return "/" + SpreadsheetHistoryHash.LABEL + "/" + this.label() + "/" + SpreadsheetHistoryHash.DELETE;
    }

    spreadsheetLabelMappingWidgetExecute(widget) {
        widget.deleteLabelMapping(this.label());
    }
}