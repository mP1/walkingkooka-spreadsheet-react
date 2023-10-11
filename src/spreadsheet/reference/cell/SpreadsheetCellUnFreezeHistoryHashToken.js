import SpreadsheetCellHistoryHashToken from "./SpreadsheetCellHistoryHashToken.js";
import SpreadsheetHistoryHashTokens from "../../history/SpreadsheetHistoryHashTokens.js";
import viewportSelectHistoryHashToken from "../../history/viewportSelectHistoryHashToken.js";

/**
 * Represents a command to unfreeze one or more cells.
 */
export default class SpreadsheetCellUnFreezeHistoryHashToken extends SpreadsheetCellHistoryHashToken {

    historyHashPath() {
        return super.historyHashPath() +
            "/" +
            SpreadsheetHistoryHashTokens.UNFREEZE;
    }

    /**
     * Handles history hash token evens such as /cell/A1/unfreeze or /cell/B2:C3/unfreeze
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