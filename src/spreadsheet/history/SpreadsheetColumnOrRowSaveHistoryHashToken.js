import Equality from "../../Equality.js";
import selectHistoryHashToken from "./selectHistoryHashToken.js";
import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "./SpreadsheetHistoryHashTokens.js";

/**
 * Represents a save column/row property with value history hash token.
 */
export default class SpreadsheetColumnOrRowSaveHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    constructor(viewportSelection, property, value) {
        super(viewportSelection);

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
        return super.toHistoryHashToken() +
            "/" +
            this.property() +
            "/" +
            encodeURIComponent(this.value());
    }

    /**
     * Handles history hash token evens such as /column/A/hidden/true or /row/1/hidden/false
     */
    spreadsheetViewportWidgetExecute(viewportCell, width, height, viewportWidget) {
        const viewportSelection = this.viewportSelection();

        viewportWidget.patchColumnOrRow(
            viewportSelection,
            this.property(),
            this.value()
        );

        // remove the saved property and value from the history hash
        const tokens = SpreadsheetHistoryHashTokens.emptyTokens();
        tokens[SpreadsheetHistoryHashTokens.SELECTION] = selectHistoryHashToken(viewportSelection);
        viewportWidget.historyParseMergeAndPush(tokens);
    }

    equals(other) {
        return super.equals(other) &&
            this.property() === other.property() &&
            Equality.safeEquals(this.value, other.value());
    }
}