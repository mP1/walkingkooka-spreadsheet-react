import SpreadsheetHistoryHashTokens from "../history/SpreadsheetHistoryHashTokens.js";
import SpreadsheetSelection from "./SpreadsheetSelection.js";
import SystemObject from "../../SystemObject.js";

/**
 * Common base class for cell-range, cell reference and label name.
 */
export default class SpreadsheetExpressionReference extends SpreadsheetSelection {

    // insertBefore not supported by cell or cell range or label
    apiInsertBeforePostUrl(urlPaths) {
        return false;
    }

    /**
     * Returns an array of all the keys for this selection. This helps SpreadsheetDelta build cellReferenceToLabel,
     * particularly a range to labels expanding to multple keys for each cell in the range.
     */
    cellMapKeys(labels) {
        SystemObject.throwUnsupportedOperation();
    }

    isCellScalarOrRange() {
        return true;
    }

    selectOptionText() {
        return this.toString();
    }

    historyHashPath() {
        return SpreadsheetHistoryHashTokens.CELL + "/" + this;
    }
}
