import SpreadsheetColumnOrRowHistoryHashToken from "./SpreadsheetColumnOrRowHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../history/viewportSelectHistoryHashToken.js";

/**
 * Represents a command to unfreeze a column or row selection.
 */
export default class SpreadsheetColumnOrRowUnFreezeHistoryHashToken extends SpreadsheetColumnOrRowHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.UNFREEZE;
    }

    /**
     * Handles history hash token evens such as /column/A/unfreeze or /column/A:C/unfreeze
     */
    spreadsheetViewportWidgetExecute(viewportWidget, previousViewport, viewportCell, width, height) {
        const viewport = this.viewport();

        viewportWidget.unFreezeSelection(
            viewport
        );

        return SpreadsheetHistoryHashTokens.viewport(
            viewportSelectHistoryHashToken(
                viewport
            )
        );
    }
}