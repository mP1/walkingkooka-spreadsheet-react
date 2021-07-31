import SystemObject from "../../SystemObject.js";
import CharSequences from "../../CharSequences.js";
import Character from "../../Character.js";

/**
 * Common base class for several types in this namespace
 */
export default class SpreadsheetSelection extends SystemObject {

    static reportInvalidCharacter(c, pos) {
        throw new Error("Invalid character " + CharSequences.quoteAndEscape(Character.fromJson(c)) + " at " + pos);
    }

    testCell(cellReference) {
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

    toString() {
        return this.toJson();
    }
}
