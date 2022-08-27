import Preconditions from "../../../Preconditions.js";
import SpreadsheetColumnOrRow from "./SpreadsheetColumnOrRow.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";

const TYPE_NAME = "spreadsheet-column";

export default class SpreadsheetColumn extends SpreadsheetColumnOrRow {

    static fromJson(json) {
        Preconditions.requireObject(json, "json");

        const keys = Object.keys(json);
        switch(keys.length) {
            case 0:
                throw new Error("Missing reference");
            case 1:
                const reference = keys[0];
                const {hidden} = json[reference];

                return new SpreadsheetColumn(
                    SpreadsheetColumnReference.fromJson(reference),
                    hidden,
                );
            default:
                throw new Error("Expected only reference got " + JSON.stringify(json));
        }
    }

    constructor(reference, hidden) {
        super(
            Preconditions.requireInstance(reference, SpreadsheetColumnReference, "reference"),
            Preconditions.requireNonNull(hidden, "hidden")
        )
    }

    patch(property, value) {
        let patched;

        switch(property) {
            case "hidden":
                patched = new SpreadsheetColumn(this.reference(), value);
                break;
            default:
                throw new Error("Unknown property: " + property);
        }

        return patched;
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