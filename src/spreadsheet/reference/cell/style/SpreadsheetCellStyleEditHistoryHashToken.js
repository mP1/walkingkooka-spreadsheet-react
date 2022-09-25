import SpreadsheetCellStyleHistoryHashToken from "./SpreadsheetCellStyleHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../../history/SpreadsheetHistoryHashTokens.js";

/**
 * A command that represents a cell style property value save.
 */
export default class SpreadsheetCellStyleEditHistoryHashToken extends SpreadsheetCellStyleHistoryHashToken {

    spreadsheetToolbarWidgetExecute(toolbarWidget, previousViewportSelection) {
        if(!(previousViewportSelection instanceof SpreadsheetCellStyleHistoryHashToken)){
            toolbarWidget.giveSelectedFocus(this.propertyName());
        }

        // no need to load cell if selection changes formula will do so.
        return SpreadsheetHistoryHashTokens.viewportSelection(this);
    }

    equals(other) {
        return super.equals(other) && other instanceof SpreadsheetCellStyleEditHistoryHashToken;
    }
}