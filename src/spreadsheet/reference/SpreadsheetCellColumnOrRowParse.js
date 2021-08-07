import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";

/**
 * This parse method is used by SpreadsheetViewportWidget to identify the selection for an individual table element,
 * such as a cell, column or row.
 */
export default function SpreadsheetCellColumnOrRowParse(text) {
    Preconditions.requireNonEmptyText(text, "text");

    // if only letters its column
    // if only digits its row
    // else must be cell-reference
    const length = text.length;
    var letterCount = 0;
    var digitCount = 0;

    for(var i = 0; i < length; i++) {
        const c = text.charAt(i).toUpperCase();

        if(c >= 'A' && c <= 'Z'){
            letterCount++;
        }else {
            if(c >= '0' && c <= '9'){
                digitCount++;
            }
        }
    }

    return letterCount > 0 && 0 === digitCount ?
        SpreadsheetColumnReference.parse(text) :
        0 === letterCount && digitCount > 0 ?
            SpreadsheetRowReference.parse(text) :
            SpreadsheetCellReference.parse(text);
}
