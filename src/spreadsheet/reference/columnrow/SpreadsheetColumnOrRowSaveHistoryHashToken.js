import Equality from "../../../Equality.js";
import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../history/viewportSelectHistoryHashToken.js";

/**
 * Represents a save column/row property with value history hash token.
 */
export default class SpreadsheetColumnOrRowSaveHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    constructor(viewport, property, value) {
        super(viewport);

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
    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            this.property() +
            "/" +
            encodeURIComponent(this.value());
    }

    /**
     * Handles history hash token evens such as /column/A/hidden/true or /row/1/hidden/false
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        const viewport = this.viewport();

        viewportWidget.patchColumnOrRow(
            viewport,
            this.property(),
            this.value()
        );

        // remove the saved property and value from the history hash
        return SpreadsheetHistoryHashTokens.viewport(
            viewportSelectHistoryHashToken(
                viewport
            )
        );
    }

    equals(other) {
        return super.equals(other) &&
            this.property() === other.property() &&
            Equality.safeEquals(this.value, other.value());
    }
}