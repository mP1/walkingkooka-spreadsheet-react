import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import spreadsheetCellReferenceOrLabelNameFromJson from "./reference/SpreadsheetCellReferenceOrLabelNameFromJson.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetLabelMapping from "./reference/SpreadsheetLabelMapping.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-expression-reference-similarities";

export default class SpreadsheetExpressionReferenceSimilarities extends SystemObject {

    static fromJson(json) {
        return SpreadsheetExpressionReferenceSimilarities.parse(json);
    }

    static parse(json) {
        Preconditions.requireObject(json, "json");

        const cellReference = json["cell-reference"];
        const labels = json["labels"];

        return new SpreadsheetExpressionReferenceSimilarities(
            cellReference && spreadsheetCellReferenceOrLabelNameFromJson(cellReference),
            labels ? labels.map(SpreadsheetLabelMapping.fromJson) : []
        );
    }

    constructor(cellReference, labels) {
        super();

        Preconditions.requireInstanceOrNull(cellReference, SpreadsheetCellReference, "cellReference");
        Preconditions.requireArray(labels, "labels");

        this.cellReferenceValue = cellReference;
        this.labelsValue = [...labels];
    }

    cellReference() {
        return this.cellReferenceValue;
    }

    labels() {
        return [...this.labelsValue];
    }

    toJson() {
        const json = {
        };

        const cellReference = this.cellReference();
        if(cellReference) {
            json["cell-reference"] = cellReference.toJson();
        }

        const labels = this.labels();
        if(labels) {
            json["labels"] = labels.map(l => l.toJson());
        }

        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return this === other ||
            (
                other instanceof SpreadsheetExpressionReferenceSimilarities &&
                Equality.safeEquals(this.cellReference(), other.cellReference()) &&
                Equality.safeEquals(this.labels(), other.labels())
            );
    }

    toString() {
        const cellReference = this.cellReference();

        return (null != cellReference ?
            cellReference + " " :
            "") +
            this.labels().join();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetExpressionReferenceSimilarities.fromJson);