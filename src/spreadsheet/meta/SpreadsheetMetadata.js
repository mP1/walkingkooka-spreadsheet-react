const DEFAULTS = "_defaults";
const SPREADSHEET_NAME = "spreadsheet-name";

function createEmpty() {
    const empty = new SpreadsheetMetadata({});
    empty.defaultSpreadsheetMetadata = empty;
    return empty;
}

function createWithName(metadata, name) {
    let copy = new SpreadsheetMetadata(metadata.json);
    copy.json[SPREADSHEET_NAME] = name;
    return copy;
}

/**
 * Makes a new defensive copy using the provided json and replaces the existing defaults.
 */
function createWithDefaults(json, defaultSpreadsheetMetadata) {
    const copy = new SpreadsheetMetadata(json);

    if (defaultSpreadsheetMetadata.json) {
        copy.json[DEFAULTS] = defaultSpreadsheetMetadata.toJson();
    }
    copy.defaultSpreadsheetMetadata = defaultSpreadsheetMetadata;
    return copy;
}

/**
 * Immutable SpreadsheetMetadata, with getters and would be setters.
 */
export default class SpreadsheetMetadata {

    static EMPTY = createEmpty();

    constructor(json) {
        this.json = Object.assign({}, json) || {} // defensive copy
    }

    /**
     * General purpose getter
     */
    get(property) {
        let json = this.json;
        var value;

        do {
            value = json[property];
            if (value) {
                break;
            }
            json = json[DEFAULTS];
        } while (json);

        return value;
    }

    /**
     * Returns the SpreadsheetMetadata which will supply defaults.
     * <pre>
     * {
     *   "create-date-time": "2000-01-02T12:58:59",
     *   "creator": "user@example.com",
     *   "_defaults": {
     *     "currency-symbol": "$AUD",
     *     "locale": "en"
     *   }
     * }
     </pre>
     */
    defaults() {
        if (!this.defaultSpreadsheetMetadata) {
            let defaultsJson = this.json[DEFAULTS];
            this.defaultSpreadsheetMetadata = (defaultsJson && new SpreadsheetMetadata(defaultsJson)) || SpreadsheetMetadata.EMPTY;
        }

        return this.defaultSpreadsheetMetadata;
    }

    setDefaults(defaultSpreadsheetMetadata) {
        return this.defaults() == defaultSpreadsheetMetadata ?
            this :
            createWithDefaults(this.json, defaultSpreadsheetMetadata);
    }

    spreadsheetId() {
        const id = this.get("spreadsheet-id");
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