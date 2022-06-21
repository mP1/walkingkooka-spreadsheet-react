import Equality from "../../Equality.js";
import SpreadsheetSettingsHistoryHashToken from "./SpreadsheetSettingsHistoryHashToken.js";

/**
 * Saves the metadata or text style property with a new value, which may be null if the property should be removed.
 */
export default class SpreadsheetSettingsSaveHistoryHashToken extends SpreadsheetSettingsHistoryHashToken {

    constructor(value) {
        super();
        this.valueValue = value;
    }

    /**
     * The value which may be null if the property was cleared or removed.
     */
    value() {
        return this.valueValue;
    }

    toHistoryHashToken() {
        const value = this.value();

        return "/" + (null != value ? encodeURIComponent(value) : "");
    }

    onSettingsAction(settingsWidget) {
        settingsWidget.patchSpreadsheetMetadata(this.value());
    }


    equals(other) {
        return this === other || (other instanceof SpreadsheetSettingsSaveHistoryHashToken && Equality.safeEquals(this.value(), other.value()));
    }
}