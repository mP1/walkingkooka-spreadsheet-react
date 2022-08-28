import CharSequences from "../../../CharSequences.js";
import Equality from "../../../Equality.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMetadataDrawerWidgetHistoryHashTokens from "./SpreadsheetMetadataDrawerWidgetHistoryHashTokens.js";
import SpreadsheetMetadataHistoryHashToken from "./SpreadsheetMetadataHistoryHashToken.js";

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

        if(item && !SpreadsheetMetadataDrawerWidgetHistoryHashTokens.isToken(item)){
            throw new Error("Unknown metadata token " + CharSequences.quoteAndEscape(item));
        }

        this.itemValue = item;
    }

    /**
     * The selected item which may be null
     */
    item() {
        return this.itemValue;
    }

    metadataDrawerWidget(metadataDrawerWidget, metadata) {
        if(!metadata) {
            metadataDrawerWidget.loadSpreadsheetMetadata(
                metadataDrawerWidget.state.id
            ); // load spreadsheet metadata when the metadata drawer opens
        }
    }

    historyHashPath() {
        const item = this.item();

        return "/" +
            SpreadsheetHistoryHashTokens.METADATA +
            (item ? "/" + item : "");
    }

    equals(other) {
        return super.equals(other) &&
            Equality.safeEquals(this.item(), other.item());
    }
}