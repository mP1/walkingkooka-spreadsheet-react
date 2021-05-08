import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetRange from "./SpreadsheetRange.js";

export default function spreadsheetExpressionReferenceFromJson(text) {
    Preconditions.requireNonEmptyText(text, "text");

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
