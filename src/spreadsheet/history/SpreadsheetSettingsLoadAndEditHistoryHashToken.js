import SpreadsheetSettingsHistoryHashToken from "./SpreadsheetSettingsHistoryHashToken.js";

/**
 * Loads and prepares a metadata or text style property for editing.
 */
export default class SpreadsheetSettingsLoadAndEditHistoryHashToken extends SpreadsheetSettingsHistoryHashToken {

    constructor(property) {
        super();
        this.propertyValue = property;
    }

    /**
     * The metadata or text style property
     */
    property() {
        return this.propertyValue;
    }

    toHistoryHashToken() {
        return encodeURI(this.property());
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetSettingsLoadAndEditHistoryHashToken && this.property() === other.property());
    }
}