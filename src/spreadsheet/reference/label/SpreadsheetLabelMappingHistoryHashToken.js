import Preconditions from "../../../Preconditions.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetHistoryHashToken from "../../history/SpreadsheetHistoryHashToken.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SystemObject from "../../../SystemObject.js";

/**
 * Base class for any label mapping history hash token.
 */
export default class SpreadsheetLabelMappingHistoryHashToken extends SpreadsheetHistoryHashToken {

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

    spreadsheetLabelMappingWidgetExecute(widget, previousLabel) {
        SystemObject.throwUnsupportedOperation();
    }

    equals(other) {
        return super.equals(other) &&
            this.label().equals(other.label());
    }
}