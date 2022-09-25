import Equality from "../../../../Equality.js";
import SpreadsheetCellHistoryHashToken from "../SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import SystemObject from "../../../../SystemObject.js";
import TextStyle from "../../../../text/TextStyle.js";

/**
 * The style token.
 */
export default class SpreadsheetCellStyleHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    constructor(selection, propertyName) {
        super(selection);

        this.propertyNameValue = TextStyle.checkPropertyName(propertyName);
    }

    /**
     * The value which may be null if the property was cleared or removed.
     */
    propertyName() {
        return this.propertyNameValue;
    }

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.STYLE +
            "/" +
            this.propertyName();
    }

    spreadsheetToolbarWidgetExecute() {
        SystemObject.throwUnsupportedOperation();
    }

    spreadsheetViewportWidgetExecute() {
        // nop
    }

    equals(other) {
        return other instanceof SpreadsheetCellStyleHistoryHashToken &&
            Equality.safeEquals(this.propertyName(), other.propertyName());
    }
}