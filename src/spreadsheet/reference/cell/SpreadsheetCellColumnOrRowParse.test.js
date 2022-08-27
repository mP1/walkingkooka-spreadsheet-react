import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetCellColumnOrRowParse from "./SpreadsheetCellColumnOrRowParse.js";
import SpreadsheetColumnReference from "../columnrow/SpreadsheetColumnReference.js";
import SpreadsheetRowReference from "../columnrow/SpreadsheetRowReference.js";

function spreadsheetCellColumnOrRowParseAndCheck(text, parse) {
    test("spreadsheetCellColumnOrRowParseAndCheck \"" + text + "\"", () => {
        expect(SpreadsheetCellColumnOrRowParse(text)).toStrictEqual(parse(text));
    });
}

spreadsheetCellColumnOrRowParseAndCheck("A", SpreadsheetColumnReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("AB", SpreadsheetColumnReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("ABC", SpreadsheetColumnReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("d", SpreadsheetColumnReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("de", SpreadsheetColumnReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("def", SpreadsheetColumnReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("$G", SpreadsheetColumnReference.parse);

spreadsheetCellColumnOrRowParseAndCheck("A1", SpreadsheetCellReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("AB12", SpreadsheetCellReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("c3", SpreadsheetCellReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("$D$4", SpreadsheetCellReference.parse);

spreadsheetCellColumnOrRowParseAndCheck("1", SpreadsheetRowReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("12", SpreadsheetRowReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("123", SpreadsheetRowReference.parse);
spreadsheetCellColumnOrRowParseAndCheck("$1234", SpreadsheetRowReference.parse);
