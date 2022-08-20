import Equality from "../../Equality.js";
import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import Preconditions from "../../Preconditions.js";
import SpreadsheetCell from "../SpreadsheetCell.js";
import TextStyle from "../../text/TextStyle.js";

/**
 * A command that represents a cell style property value save.
 */
export default class SpreadsheetCellStyleSaveHistoryHashToken extends SpreadsheetCellStyleHistoryHashToken {

    constructor(selection, propertyName, propertyValue) {
        super(selection);
        this.propertyNameValue = Preconditions.requireText(propertyName, "propertyName");
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
            (null != value ? encodeURIComponent(value) : "");
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        viewportWidget.patchCell(
            new SpreadsheetCell(
                this.viewportSelection().selection(),
                null, // formula
                TextStyle.EMPTY.set(
                    this.propertyName(),
                    this.propertyValue()
                )
            )
        );
    }

    equals(other) {
        return this === other ||
            (
                other instanceof SpreadsheetCellStyleSaveHistoryHashToken &&
                Equality.safeEquals(this.propertyName(), other.propertyName()) &&
                Equality.safeEquals(this.propertyValue(), other.propertyValue())
            );
    }
}