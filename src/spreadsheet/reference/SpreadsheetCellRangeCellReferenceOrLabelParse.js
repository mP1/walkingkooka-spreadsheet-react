import Preconditions from "../../Preconditions.js";
import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

export default function spreadsheetCellRangeCellReferenceOrLabelParse(text) {
    Preconditions.requireNonEmptyText(text, "text");

    var reference;
    if(text.indexOf(":") >= 0) {
        reference = SpreadsheetCellRange.fromJson(text);
    } else {
        if(SpreadsheetCellReference.isCellReferenceText(text)) {
            reference = SpreadsheetCellReference.fromJson(text);
        } else {
            reference = SpreadsheetLabelName.fromJson(text);
        }
    }

    return reference;
}
