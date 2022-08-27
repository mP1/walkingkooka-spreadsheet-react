import Preconditions from "../../../Preconditions.js";
import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetLabelName from "../label/SpreadsheetLabelName.js";

export default function spreadsheetCellReferenceOrLabelNameParse(text) {
    Preconditions.requireNonEmptyText(text, "text");

    return text.indexOf(":") > 0 ?
        SpreadsheetCellRange.parse(text) :
        SpreadsheetCellReference.isCellReferenceText(text) ?
            SpreadsheetCellReference.fromJson(text) :
            SpreadsheetLabelName.fromJson(text);
}
