import Equality from "../../../../Equality.js";
import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import TextStyle from "../../../../text/TextStyle.js";

/**
 * A command that represents a cell style property value save.
 */
export default class SpreadsheetCellStyleEditHistoryHashToken extends SpreadsheetCellStyleHistoryHashToken {

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

    // /cell/A1/style/font-style/edit
    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            this.propertyName() +
            "/" +
            SpreadsheetHistoryHashTokens.EDIT;
    }

    spreadsheetToolbarWidgetExecute(toolbarWidget, previousViewportSelection) {
        if(!(previousViewportSelection instanceof SpreadsheetCellStyleHistoryHashToken)){
            toolbarWidget.giveSelectedFocus(this.propertyName());
        }

        // no need to load cell if selection changes formula will do so.
        return SpreadsheetHistoryHashTokens.viewportSelection(this);
    }

    equals(other) {
        return this === other ||
            (
                other instanceof SpreadsheetCellStyleEditHistoryHashToken &&
                Equality.safeEquals(this.propertyName(), other.propertyName())
            );
    }
}