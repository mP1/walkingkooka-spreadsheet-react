import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import SystemObject from "../../../../SystemObject.js";

/**
 * The style token.
 */
export default class SpreadsheetCellStyleHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.STYLE;
    }

    spreadsheetToolbarWidgetExecute() {
        SystemObject.throwUnsupportedOperation();
    }

    spreadsheetViewportWidgetExecute() {
        // nop
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetCellStyleHistoryHashToken);
    }
}