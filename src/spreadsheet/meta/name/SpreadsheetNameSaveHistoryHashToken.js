import Equality from "../../../Equality.js";
import Preconditions from "../../../Preconditions.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetMetadata from "../SpreadsheetMetadata.js";
import SpreadsheetName from "./SpreadsheetName.js";
import SpreadsheetNameEditHistoryHashToken from "./SpreadsheetNameEditHistoryHashToken.js";
import SpreadsheetNameHistoryHashToken from "./SpreadsheetNameHistoryHashToken.js";

/**
 * Saves the given spreadsheet name..
 */
export default class SpreadsheetNameSaveHistoryHashToken extends SpreadsheetNameHistoryHashToken {

    constructor(value) {
        super();
        Preconditions.requireInstance(value, SpreadsheetName, "value");
        this.valueValue = value;
    }

    /**
     * The spreadsheetname to save.
     */
    value() {
        return this.valueValue;
    }

    spreadsheetNameWidgetExecute(spreadsheetNameWidget) {
        spreadsheetNameWidget.patchSpreadsheetMetadataProperty(
            SpreadsheetMetadata.SPREADSHEET_NAME,
            this.value()
        );

        const historyTokens = SpreadsheetHistoryHashTokens.emptyTokens();
        historyTokens[SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_EDIT] = new SpreadsheetNameEditHistoryHashToken();
        return historyTokens;
    }

    historyHashPath() {
        return "/" +
            SpreadsheetHistoryHashTokens.SPREADSHEET_NAME_PATH +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            encodeURIComponent(this.value().value());
    }

    equals(other) {
        return super.equals(other) &&
            Equality.safeEquals(this.value(), other.value());
    }
}