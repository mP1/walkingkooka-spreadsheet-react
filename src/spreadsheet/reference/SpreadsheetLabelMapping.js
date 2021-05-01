import CharSequences from "../../CharSequences.js";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import spreadsheetExpressionReferenceFromJson from "./SpreadsheetExpressionReferenceFromJson.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SystemObject from "../../SystemObject.js";

function checkLabel(label) {
    if(!label){
        throw new Error("Missing label");
    }
    if(!(label instanceof SpreadsheetLabelName)){
        throw new Error("Expected SpreadsheetLabelName label got " + label);
    }
}

function checkReference(reference) {
    if(!reference){
        throw new Error("Missing reference");
    }
    if(!(reference instanceof SpreadsheetExpressionReference)){
        throw new Error("Expected SpreadsheetExpressionReference reference got " + reference);
    }
}

const TYPE_NAME = "spreadsheet-label-mapping";

export default class SpreadsheetLabelMapping extends SystemObject {

    static fromJson(json) {
        if(null == json){
            throw new Error("Missing json");
        }
        if(typeof json !== "object"){
            throw new Error("Expected object got " + json);
        }
        const {label, reference} = json;
        return new SpreadsheetLabelMapping(
            SpreadsheetLabelName.fromJson(label),
            spreadsheetExpressionReferenceFromJson(reference)
        );
    }

    constructor(label, reference) {
        super();
        checkLabel(label);
        checkReference(reference);

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
        return this === other || (other instanceof SpreadsheetLabelMapping && this.label().equals(other.label()) && this.reference().equals(other.reference()));
    }

    toString() {
        return JSON.stringify(this.toJson());
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetLabelMapping.fromJson);