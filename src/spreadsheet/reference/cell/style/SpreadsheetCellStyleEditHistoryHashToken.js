import CharSequences from "../../../../CharSequences.js";
import Equality from "../../../../Equality.js";
import Preconditions from "../../../../Preconditions.js";
import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";
import TextStyle from "../../../../text/TextStyle.js";

/**
 * A command that represents a cell style property value save.
 */
export default class SpreadsheetCellStyleEditHistoryHashToken extends SpreadsheetCellStyleHistoryHashToken {

    constructor(selection, propertyName) {
        super(selection);

        this.propertyNameValue = Preconditions.requireText(propertyName, "propertyName");

        if(!TextStyle.isProperty(propertyName)){
            throw new Error("Unknown style property " + CharSequences.quoteAndEscape(propertyName));
        }
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

    spreadsheetViewportWidgetExecute(viewportWidget, viewportCell, width, height) {
        // TODO give focus to style property editor widget
    }

    equals(other) {
        return this === other ||
            (
                other instanceof SpreadsheetCellStyleEditHistoryHashToken &&
                Equality.safeEquals(this.propertyName(), other.propertyName())
            );
    }
}