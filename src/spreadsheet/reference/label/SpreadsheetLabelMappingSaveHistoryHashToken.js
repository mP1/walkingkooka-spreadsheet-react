import Preconditions from "../../../Preconditions.js";
import SpreadsheetExpressionReference from "../SpreadsheetExpressionReference.js";
import SpreadsheetHistoryHash from "../../history/SpreadsheetHistoryHash.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

/**
 * A history hash token that represents a label mapping save including the reference or target of the mapping.
 */
export default class SpreadsheetLabelMappingSaveHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    constructor(label, newLabel, reference) {
        super();

        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");
        Preconditions.requireInstance(newLabel, SpreadsheetLabelName, "newLabel");
        Preconditions.requireInstance(reference, SpreadsheetExpressionReference, "reference");

        this.labelValue = label;
        this.newLabelValue = newLabel;
        this.referenceValue = reference;
    }

    label() {
        return this.labelValue;
    }

    newLabel() {
        return this.newLabelValue;
    }

    reference() {
        return this.referenceValue;
    }

    // /label/$label/save/$newLabel/$newReference
    historyHashPath() {
        return "/" + SpreadsheetHistoryHash.LABEL + "/" + this.label() + "/" + SpreadsheetHistoryHash.SAVE + "/" + this.newLabel() + "/" + this.reference();
    }

    spreadsheetLabelMappingWidgetExecute(widget) {
        widget.saveLabelMapping(
            this.label(),
            this.newLabel(),
            this.reference()
        );
    }

    equals(other) {
        return super.equals(other) &&
                this.label().equals(other.label()) &&
                this.newLabel().equals(other.newLabel()) &&
                this.reference().equals(other.reference());
    }
}