import CharSequences from "../../../CharSequences.js";
import Preconditions from "../../../Preconditions.js";
import spreadsheetCellRangeCellReferenceOrLabelParse from "../cell/SpreadsheetCellRangeCellReferenceOrLabelParse.js";
import SpreadsheetExpressionReference from "../SpreadsheetExpressionReference.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SystemObject from "../../../SystemObject.js";

const TYPE_NAME = "spreadsheet-label-mapping";

export default class SpreadsheetLabelMapping extends SystemObject {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const {label, reference} = json;
        return new SpreadsheetLabelMapping(
            SpreadsheetLabelName.fromJson(label),
            spreadsheetCellRangeCellReferenceOrLabelParse(reference)
        );
    }

    constructor(label, reference) {
        super();
        Preconditions.requireInstance(label, SpreadsheetLabelName, "label");
        Preconditions.requireInstance(reference, SpreadsheetExpressionReference, "reference");

        if(label.equals(reference)) {
            throw new Error("Reference " + CharSequences.quoteAndEscape(reference.toString()) + " must be different to label " + CharSequences.quoteAndEscape(label.toString()));
        }

        this.labelValue = label;
        this.referenceValue = reference;
    }

    label() {
        return this.labelValue;
    }

    reference() {
        return this.referenceValue;
    }

    selectOptionText() {
        return this.label().selectOptionText();
    }

    toJson() {
        return {
          label: this.label().toJson(),
          reference: this.reference().toJson(),
        };
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetLabelMapping &&
            this.label().equals(other.label()) &&
            this.reference().equals(other.reference());
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetLabelMapping.fromJson);