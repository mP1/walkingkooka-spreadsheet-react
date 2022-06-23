import Equality from "../../Equality.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";
import SpreadsheetSettingsHistoryHashToken from "./SpreadsheetSettingsHistoryHashToken.js";

/**
 * This token represents a selection of a settings section or property.
 */
export default class SpreadsheetSettingsSelectHistoryHashToken extends SpreadsheetSettingsHistoryHashToken {

    /**
     * Used to indicate the drawer has been opened but no accordion header or property selected.
     */
    static NOTHING = new SpreadsheetSettingsSelectHistoryHashToken();

    constructor(item) {
        super();
        this.itemValue = item;
    }

    /**
     * The selected item which may be null
     */
    item() {
        return this.itemValue;
    }

    onSettingsAction(settingsWidget) {
        // nop
    }

    toHistoryHashToken() {
        const item = this.item();

        return "/" +
            SpreadsheetHistoryHashTokens.SETTINGS +
            (item ? "/" + item : "");
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetSettingsSelectHistoryHashToken && Equality.safeEquals(this.item(), other.item()));
    }
}