import Preconditions from "../../Preconditions.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";

export default function spreadsheetCellReferenceOrLabelNameFromJson(text) {
    Preconditions.requireNonEmptyText(text, "text");

    return SpreadsheetCellReference.isCellReferenceText(text) ?
        SpreadsheetCellReference.fromJson(text) :
        SpreadsheetLabelName.fromJson(text);
}
