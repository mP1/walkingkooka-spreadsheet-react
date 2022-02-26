import Equality from "../../Equality.js";
import SpreadsheetColumnOrRowSelectionActionHistoryHashToken
    from "./SpreadsheetColumnOrRowSelectionActionHistoryHashToken.js";

/**
 * Represents a save column/row property with value history hash token.
 */
export default class SpreadsheetColumnOrRowSaveHistoryHashToken extends SpreadsheetColumnOrRowSelectionActionHistoryHashToken {

    constructor(property, value) {
        super();
        this.propertyValue = property;
        this.valueValue = value;
    }

    property() {
        return this.propertyValue;
    }

    value() {
        return this.valueValue;
    }

    // /$property/value
    toHistoryHashToken() {
        return this.property() + "/" + encodeURIComponent(this.value());
    }

    /**
     * Handles history hash token evens such as /column/A/hidden/true or /row/1/hidden/false
     */
    onViewportSelectionAction(selection, viewportWidget) {
        viewportWidget.patchColumnOrRow(
            selection,
            this.property(),
            this.value()
        );
    }

    equals(other) {
        return this === other || (other instanceof SpreadsheetColumnOrRowSaveHistoryHashToken && this.property() === other.property() && Equality.safeEquals(this.value, other.value()));
    }
}