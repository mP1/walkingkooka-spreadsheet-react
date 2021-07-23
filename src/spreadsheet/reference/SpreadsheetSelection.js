import SystemObject from "../../SystemObject.js";

/**
 * Common base class for several types in this namespace
 */
export default class SpreadsheetSelection extends SystemObject {

    test(cellReference) {
        throw new Error("Not yet implemented");
    }

    testColumn(columnReference) {
        throw new Error("Not yet implemented");
    }

    testRow(rowReference) {
        throw new Error("Not yet implemented");
    }

    toSelectionHashToken() {
        throw new Error("Not yet implemented");
    }
}
