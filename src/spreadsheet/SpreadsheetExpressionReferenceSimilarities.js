import Equality from "../Equality.js";
import Preconditions from "../Preconditions.js";
import SpreadsheetCellReference from "./reference/cell/SpreadsheetCellReference.js";
import SpreadsheetLabelMapping from "./reference/label/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./reference/label/SpreadsheetLabelName.js";
import SystemObject from "../SystemObject.js";

const TYPE_NAME = "spreadsheet-expression-reference-similarities";

export default class SpreadsheetExpressionReferenceSimilarities extends SystemObject {

    static fromJson(json) {
        return SpreadsheetExpressionReferenceSimilarities.parse(json);
    }

    static parse(json) {
        Preconditions.requireObject(json, "json");

        const cellReference = json["cell-reference"];
        const label = json["label"];
        const labelMappings = json["label-mappings"];

        return new SpreadsheetExpressionReferenceSimilarities(
            cellReference && SpreadsheetCellReference.fromJson(cellReference),
            label && SpreadsheetLabelName.fromJson(label),
            labelMappings ? labelMappings.map(SpreadsheetLabelMapping.fromJson) : []
        );
    }

    constructor(cellReference, label, labelMappings) {
        super();

        Preconditions.optionalInstance(cellReference, SpreadsheetCellReference, "cellReference");
        Preconditions.optionalInstance(label, SpreadsheetLabelName, "label");
        Preconditions.requireArray(labelMappings, "labelMappings");

        this.cellReferenceValue = cellReference;
        this.labelValue = label;
        this.labelMappingsValue = [...labelMappings];
    }

    cellReference() {
        return this.cellReferenceValue;
    }

    label() {
        return this.labelValue;
    }

    labelMappings() {
        return [...this.labelMappingsValue];
    }

    toJson() {
        const json = {
        };

        const cellReference = this.cellReference();
        if(cellReference) {
            json["cell-reference"] = cellReference.toJson();
        }

        const label = this.label();
        if(label) {
            json["label"] = label.toJson();
        }

        const labelMappings = this.labelMappings();
        if(labelMappings) {
            json["label-mappings"] = labelMappings.map(m => m.toJson());
        }

        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    equals(other) {
        return other instanceof SpreadsheetExpressionReferenceSimilarities &&
            Equality.safeEquals(this.cellReference(), other.cellReference()) &&
            Equality.safeEquals(this.label(), other.label()) &&
            Equality.safeEquals(this.labelMappings(), other.labelMappings());
    }

    toString() {
        const cellReference = this.cellReference();
        const label = this.label();

        return (null != cellReference ?
            cellReference + " " :
            "") +
            (null != label ?
                label + " " :
                "") +
            this.labelMappingsValue().join();
    }
}

SystemObject.register(TYPE_NAME, SpreadsheetExpressionReferenceSimilarities.fromJson);