import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetExpressionReference from "../reference/SpreadsheetExpressionReference.js";
import SpreadsheetLabelName from "../reference/SpreadsheetLabelName.js";

/**
 * A history hash token that represents a label mapping save including the reference or target of the mapping.
 */
export default class SpreadsheetLabelMappingSaveHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    constructor(newLabel, reference) {
        super();

        Preconditions.requireInstance(newLabel, SpreadsheetLabelName, "newLabel");
        Preconditions.requireInstance(reference, SpreadsheetExpressionReference, "reference");

        this.newLabelValue = newLabel;
        this.referenceValue = reference;
    }

    newLabel() {
        return this.newLabelValue;
    }

    reference() {
        return this.referenceValue;
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.SAVE + "/" + this.newLabel() + "/" + this.reference();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetLabelMappingSaveHistoryHashToken) && this.newLabel().equals(other.newLabel()) && this.reference().equals(other.reference());
    }
}