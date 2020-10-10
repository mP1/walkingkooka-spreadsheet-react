const SPREADSHEET_NAME = "spreadsheet-name";

/**
 * Immutable SpreadsheetMetadata, with getters and would be setters.
 */
export default class SpreadsheetMetadata {

    static EMPTY = new SpreadsheetMetadata({});

    constructor(json) {
        this.json = Object.assign({}, json) || {} // defensive copy
    }

    spreadsheetId() {
        const id = this.json["spreadsheet-id"];
        if (!id) {
            throw new Error("Missing \"spreadsheet-id\" " + this);
        }
        return id;
    }

    spreadsheetName() {
        return this.json["spreadsheet-name"];
    }

    setSpreadsheetName(name) {
        return new SpreadsheetMetadata(Object.assign({}, this.json, {"spreadsheet-name": name}));
    }

    /**
     * Returns an Object representing this instance. Useful when posting to a server. Should probably never be necessary
     * but is available.
     */
    toObject() {
        return Object.assign({}, this.json);
    }

    /**
     * Returns this metadata as a JSON STRING. Perfect to perform REST api calls.
     */
    toJson() {
        return this.toString();
    }

    toString() {
        return JSON.stringify(this.json);
    }
}