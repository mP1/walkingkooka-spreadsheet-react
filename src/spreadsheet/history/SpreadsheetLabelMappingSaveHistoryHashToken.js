import SpreadsheetHistoryHash from "./SpreadsheetHistoryHash.js";
import SpreadsheetLabelMappingHistoryHashToken from "./SpreadsheetLabelMappingHistoryHashToken.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetExpressionReference from "../reference/SpreadsheetExpressionReference.js";

/**
 * A history hash token that represents a label mapping save including the reference or target of the mapping.
 */
export default class SpreadsheetLabelMappingSaveHistoryHashToken extends SpreadsheetLabelMappingHistoryHashToken {

    constructor(reference) {
        super();

        Preconditions.requireInstance(reference, SpreadsheetExpressionReference, "reference");
        this.referenceValue = reference;
    }

    reference() {
        return this.referenceValue;
    }

    toHistoryHashToken() {
        return SpreadsheetHistoryHash.SAVE + "/" + this.reference();
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetLabelMappingSaveHistoryHashToken);
    }
}