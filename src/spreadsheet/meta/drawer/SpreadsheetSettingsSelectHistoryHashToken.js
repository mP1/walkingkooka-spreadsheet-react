import CharSequences from "../../../CharSequences.js";
import Equality from "../../../Equality.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetSettingsHistoryHashToken from "./SpreadsheetSettingsHistoryHashToken.js";
import SpreadsheetSettingsWidgetHistoryHashTokens from "./SpreadsheetSettingsWidgetHistoryHashTokens.js";

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

        if(item && !SpreadsheetSettingsWidgetHistoryHashTokens.isToken(item)){
            throw new Error("Unknown settings token " + CharSequences.quoteAndEscape(item));
        }

        this.itemValue = item;
    }

    /**
     * The selected item which may be null
     */
    item() {
        return this.itemValue;
    }

    settingsWidgetExecute(settingsWidget, previousSettings) {
        if(!previousSettings) {
            settingsWidget.loadSpreadsheetMetadata(); // load spreadsheet metadata when the settings drawer opens
        }
    }

    historyHashPath() {
        const item = this.item();

        return "/" +
            SpreadsheetHistoryHashTokens.SETTINGS +
            (item ? "/" + item : "");
    }

    equals(other) {
        return super.equals(other) &&
            Equality.safeEquals(this.item(), other.item());
    }
}