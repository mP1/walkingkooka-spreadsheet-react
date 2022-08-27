import Preconditions from "../../../Preconditions.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

/**
 * A history hash token that represents a label mapping save including the reference or target of the mapping.
 */
export default class SpreadsheetLabelMappingEditHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    constructor(label) {
        super();

        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");

        this.labelValue = label;
    }

    label() {
        return this.labelValue;
    }

    historyHashPath() {
        return "/" + SpreadsheetHistoryHash.LABEL + "/" + this.label();
    }

    spreadsheetLabelMappingWidgetExecute(widget) {
        widget.loadLabelMapping(this.label());
    }

    equals(other) {
        return super.equals(other) &&
            this.label().equals(other.label());
    }
}