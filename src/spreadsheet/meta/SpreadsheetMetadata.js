const SPREADSHEET_NAME = "spreadsheet-name";

function createWithName(metadata, name) {
    let copy = new SpreadsheetMetadata(metadata.json);
    copy.json[SPREADSHEET_NAME] = name;
    return copy;
}

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
        return this.json[SPREADSHEET_NAME];
    }

    setSpreadsheetName(name) {
        return name == this.spreadsheetName() ?
            this :
            createWithName(this, name);
    }

    /**
     * Returns an Object representing this instance. Useful when posting to a server. Should probably never be necessary
     * but is available.
     */
    toObject() {
        return Object.assign({}, this.json);
    }

    /**
     * Returns this metadata as a JSON object. This must be JSON.stringify for use in JSON calls
     */
    toJson() {
        return Object.assign({}, this.json);
    }

    toString() {
        return JSON.stringify(this.json);
    }
}