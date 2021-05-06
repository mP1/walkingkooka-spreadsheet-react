import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

export default function spreadsheetCellReferenceOrLabelNameFromJson(text) {
    if(!text){
        throw new Error("Missing text");
    }
    if(typeof text !== "string"){
        throw new Error("Expected string got " + text);
    }

    return SpreadsheetCellReference.isCellReferenceText(text) ?
        SpreadsheetCellReference.fromJson(text) :
        SpreadsheetLabelName.fromJson(text);
}
