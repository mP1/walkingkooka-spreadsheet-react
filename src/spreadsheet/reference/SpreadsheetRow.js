import Preconditions from "../../Preconditions.js";
import SpreadsheetColumnOrRow from "./SpreadsheetColumnOrRow.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";

const TYPE_NAME = "spreadsheet-row";

export default class SpreadsheetRow extends SpreadsheetColumnOrRow {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const keys = Object.keys(json);
        switch(keys.length) {
            case 0:
                throw new Error("Missing reference");
            case 1:
                const reference = keys[0];
                const {hidden} = json[reference];

                return new SpreadsheetRow(
                    SpreadsheetRowReference.fromJson(reference),
                    hidden,
                );
            default:
                throw new Error("Expected only reference got " + JSON.stringify(json));
        }
    }

    constructor(reference, hidden) {
        super(
            Preconditions.requireInstance(reference, SpreadsheetRowReference, "reference"),
            Preconditions.requireNonNull(hidden, "hidden")
        )
    }

    // JSON.............................................................................................................

    toJson() {
        const json = {};
        json[this.reference().toString()] =  {
            hidden: this.hidden(),
        };
        return json;
    }

    typeName() {
        return TYPE_NAME;
    }

    // toString.........................................................................................................

    toString() {
        return JSON.stringify(this.toJson());
    }
}