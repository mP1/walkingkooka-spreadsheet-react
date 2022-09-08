import Equality from "../../../../Equality.js";
import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import TextStyle from "../../../../text/TextStyle.js";

/**
 * A command that represents a cell style property value save.
 */
export default class SpreadsheetCellStyleSaveHistoryHashToken extends SpreadsheetCellStyleHistoryHashToken {

    constructor(selection, propertyName, propertyValue) {
        super(selection);

        this.propertyNameValue = TextStyle.checkPropertyName(propertyName);
        this.propertyValueValue = propertyValue;
    }

    /**
     * The value which may be null if the property was cleared or removed.
     */
    propertyName() {
        return this.propertyNameValue;
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
            this.propertyName() +
            "/" +
            SpreadsheetHistoryHashTokens.SAVE +
            "/" +
            (null != value ? encodeURIComponent(value) : "");
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        viewportWidget.patchStyle(
            this.viewportSelection().selection(),
            this.propertyName(),
            this.propertyValue()
        );

        viewportWidget.historyPushSelectionOnly();
    }

    equals(other) {
        return this === other ||
            (
                other instanceof SpreadsheetCellStyleSaveHistoryHashToken &&
                this.propertyName() === other.propertyName() &&
                Equality.safeEquals(this.propertyValue(), other.propertyValue())
            );
    }
}