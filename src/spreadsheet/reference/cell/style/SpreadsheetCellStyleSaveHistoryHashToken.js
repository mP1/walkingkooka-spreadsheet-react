import Equality from "../../../../Equality.js";
import SpreadsheetCellStyleEditHistoryHashToken from "./SpreadsheetCellStyleEditHistoryHashToken.js";
import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";

/**
 * A command that represents a cell style property value save.
 */
export default class SpreadsheetCellStyleSaveHistoryHashToken extends SpreadsheetCellStyleHistoryHashToken {

    constructor(selection, propertyName, propertyValue) {
        super(selection, propertyName);

        this.propertyValueValue = propertyValue;
    }
    /**
     * The value which may be null if the property was cleared or removed.
     */
    propertyValue() {
        return this.propertyValueValue;
    }

    historyHashPath() {
        const value = this.propertyValue();

        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            (null != value ? encodeURIComponent(value) : "");
    }

    spreadsheetToolbarWidgetExecute(toolbarWidget, previousViewport) {
        const viewport = this.viewport();
        const propertyName = this.propertyName();

        // want to avoid multiple save (PATCH) requests to server.
        if(!this.equals(previousViewport)) {
            toolbarWidget.patchStyle(
                viewport.selection(),
                propertyName,
                this.propertyValue()
            );
        }

        return SpreadsheetHistoryHashTokens.viewport(
            previousViewport instanceof SpreadsheetCellStyleHistoryHashToken ?
                new SpreadsheetCellStyleEditHistoryHashToken(
                    viewport,
                    propertyName
                ) :
                null
        );
    }

    equals(other) {
        return super.equals(other) &&
            other instanceof SpreadsheetCellStyleSaveHistoryHashToken &&
            Equality.safeEquals(this.propertyValue(), other.propertyValue());
    }
}