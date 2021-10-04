import Equality from "../../Equality.js";
import SpreadsheetSettingsHistoryHashToken from "./SpreadsheetSettingsHistoryHashToken.js";

/**
 * Saves the metadata or text style property with a new value.
 */
export default class SpreadsheetSettingsSaveHistoryHashToken extends SpreadsheetSettingsHistoryHashToken {

    constructor(property, value) {
        super();
        this.propertyValue = property;
        this.valueValue = value;
    }

    /**
     * The metadata or text style property
     */
    property() {
        return this.propertyValue;
    }

    /**
     * The value which may be null if the property was cleared or removed.
     */
    value() {
        return this.valueValue;
    }

    toHistoryHashToken() {
        return encodeURI(this.property());
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetSettingsSaveHistoryHashToken && this.property() === other.property() && Equality.safeEquals(this.value(), other.value()));
    }
}