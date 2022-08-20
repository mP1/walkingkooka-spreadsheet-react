import Equality from "../../Equality.js";
import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import Preconditions from "../../Preconditions.js";

/**
 * A command that represents a cell style property value save.
 */
export default class SpreadsheetCellStyleEditHistoryHashToken extends SpreadsheetCellStyleHistoryHashToken {

    constructor(selection, propertyName) {
        super(selection);

        this.propertyNameValue = Preconditions.requireText(propertyName, "propertyName");
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
            this.propertyName();
    }

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // nop
    }

    equals(other) {
        return this === other ||
            (
                other instanceof SpreadsheetCellStyleEditHistoryHashToken &&
                Equality.safeEquals(this.propertyName(), other.propertyName())
            );
    }
}