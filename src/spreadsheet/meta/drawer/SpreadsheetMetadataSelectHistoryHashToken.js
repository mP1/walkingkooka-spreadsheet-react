import CharSequences from "../../../CharSequences.js";
import Equality from "../../../Equality.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMetadataHistoryHashToken from "./SpreadsheetMetadataHistoryHashToken.js";
import SpreadsheetMetadataWidgetHistoryHashTokens from "./SpreadsheetMetadataWidgetHistoryHashTokens.js";

/**
 * This token represents a selection of a metadata section or property.
 */
export default class SpreadsheetMetadataSelectHistoryHashToken extends SpreadsheetMetadataHistoryHashToken {

    /**
     * Used to indicate the drawer has been opened but no accordion header or property selected.
     */
    static NOTHING = new SpreadsheetMetadataSelectHistoryHashToken();

    constructor(item) {
        super();

        if(item && !SpreadsheetMetadataWidgetHistoryHashTokens.isToken(item)){
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

    metadataDrawerWidget(metadataDrawerWidget, previousSettings) {
        if(!previousSettings) {
            metadataDrawerWidget.loadSpreadsheetMetadata(); // load spreadsheet metadata when the settings drawer opens
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