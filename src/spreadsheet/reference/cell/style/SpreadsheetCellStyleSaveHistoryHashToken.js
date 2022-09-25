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

    spreadsheetToolbarWidgetExecute(toolbarWidget, previousViewportSelection) {
        const viewportSelection = this.viewportSelection();
        const propertyName = this.propertyName();

        // want to avoid multiple save (PATCH) requests to server.
        if(!this.equals(previousViewportSelection)) {
            toolbarWidget.patchStyle(
                viewportSelection.selection(),
                propertyName,
                this.propertyValue()
            );
        }

        return SpreadsheetHistoryHashTokens.viewportSelection(
            previousViewportSelection instanceof SpreadsheetCellStyleHistoryHashToken ?
                new SpreadsheetCellStyleEditHistoryHashToken(
                    viewportSelection,
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