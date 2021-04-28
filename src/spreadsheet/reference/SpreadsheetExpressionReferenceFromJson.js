import SpreadsheetRange from "./SpreadsheetRange.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";

export default function spreadsheetExpressionReferenceFromJson(text) {
    if(!text){
        throw new Error("Missing text");
    }
    if(typeof text !== "string"){
        throw new Error("Expected string got " + text);
    }

    var reference;
    if(text.indexOf(":") >= 0) {
        reference = SpreadsheetRange.fromJson(text);
    } else {
        if(SpreadsheetCellReference.isCellReferenceText(text)) {
            reference = SpreadsheetCellReference.fromJson(text);
        } else {
            reference = SpreadsheetLabelName.fromJson(text);
        }
    }

    return reference;
}
