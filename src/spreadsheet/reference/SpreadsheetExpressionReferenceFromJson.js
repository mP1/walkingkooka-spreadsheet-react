import SpreadsheetRange from "./SpreadsheetRange.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";

export default function spreadsheetExpressionReferenceFromJson(json) {
    if(!json){
        throw new Error("Missing json");
    }
    if(typeof json !== "string"){
        throw new Error("Expected string got " + json);
    }

    var reference;
    if(json.indexOf(":") >= 0) {
        reference = SpreadsheetRange.fromJson(json);
    } else {
        if(SpreadsheetCellReference.isCellReferenceText(json)) {
            reference = SpreadsheetCellReference.fromJson(json);
        } else {
            reference = SpreadsheetLabelName.fromJson(json);
        }
    }

    return reference;
}
