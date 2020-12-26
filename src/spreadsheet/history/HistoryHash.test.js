import HistoryHash from "./HistoryHash.js";
import SpreadsheetName from "../SpreadsheetName.js";
import SpreadsheetCellReference from "../reference/SpreadsheetCellReference.js";


// parse..................................................................................................................

test("tokenize undefined", () => {
    expect(HistoryHash.tokenize())
        .toStrictEqual([]);
});

test("tokenize empty", () => {
    expect(HistoryHash.tokenize(""))
        .toStrictEqual([]);
});

test("tokenize missing leading slash", () => {
    expect(HistoryHash.tokenize("spreadsheet1/spreadsheet-name-2"))
        .toStrictEqual([]);
});

test("tokenize slash", () => {
    expect(HistoryHash.tokenize("/"))
        .toStrictEqual([""]);
});

test("tokenize /spreadsheetId", () => {
    expect(HistoryHash.tokenize("/123"))
        .toStrictEqual(["123"]);
});

test("tokenize /spreadsheetId/spreadsheetname", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2"))
        .toStrictEqual(["1",
            "spreadsheet-name-2"]);
});

test("tokenize /spreadsheetId/spreadsheetname/", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            ""]);
});

test("tokenize /spreadsheetId/spreadsheetname/cell", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/cell"))
        .toStrictEqual(["1", "spreadsheet-name-2", "cell"]);
});

test("tokenize /spreadsheetId/spreadsheetname/cell/", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/cell/"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            "cell",
            ""]);
});

test("tokenize /spreadsheetId/spreadsheetname/cell/cell-reference", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/cell/cell-reference"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            "cell",
            "cell-reference"]);
});

test("tokenize /spreadsheetId/spreadsheetname/cell/cell-reference/", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/cell/cell-reference/"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            "cell",
            "cell-reference",
            ""]);
});

test("tokenize /spreadsheetId/spreadsheetname/cell/cell-reference/action", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/cell/cell-4/action-5"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            "cell",
            "cell-4",
            "action-5"]);
});

test("tokenize /spreadsheetId/spreadsheetname/target/cell/cell-reference/action/extra", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/cell/cell-4/action-5/extra-6"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            "cell",
            "cell-4",
            "action-5",
            "extra-6"]);
});

test("tokenize /spreadsheetId/spreadsheetname/name/edit", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/name/edit"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            "name",
            "edit"]);
});

test("tokenize /spreadsheetId/spreadsheetname/unknown/unknown", () => {
    expect(HistoryHash.tokenize("/1/spreadsheet-name-2/unknown-3/unknown-4"))
        .toStrictEqual(["1",
            "spreadsheet-name-2",
            "unknown-3",
            "unknown-4"]);
});

// parse..................................................................................................................

test("join undefined tokens fails", () => {
    expect(() => HistoryHash.join()).toThrow("Missing tokens");
});

test("join null tokens fails", () => {
    expect(() => HistoryHash.join()).toThrow("Missing tokens");
});

test("join tokens empty", () => {
    expect(HistoryHash.join([]))
        .toStrictEqual("/");
});

test("join tokens spreadsheet-id", () => {
    expect(HistoryHash.join(["spreadsheet-1"]))
        .toStrictEqual("/spreadsheet-1");
});

test("join tokens spreadsheet-id, spreadsheet-name", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2")]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2");
});

test("join tokens spreadsheet-id, spreadsheet-name, undefined, ignored", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), undefined, "ignored"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2");
});

test("join tokens spreadsheet-id, spreadsheet-name, null, ignored", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), null, "ignored"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2");
});

test("join tokens spreadsheet-id, spreadsheet-name, empty", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), ""]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/");
});

test("join tokens spreadsheet-id, spreadsheet-name, cell", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell");
});

test("join tokens spreadsheet-id, spreadsheet-name, cell, cell-reference", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell", SpreadsheetCellReference.parse("D4")]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell/D4");
});

test("join tokens spreadsheet-id, spreadsheet-name, cell, cell-reference, action", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell", SpreadsheetCellReference.parse("D4"), "edit-5"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell/D4/edit-5");
});

test("join tokens spreadsheet-id, spreadsheet-name, cell, cell-reference, action, extra", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell", SpreadsheetCellReference.parse("D4"), "edit-5", "extra-6"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell/D4/edit-5/extra-6");
});

test("join tokens spreadsheet-id, spreadsheet-name, cell, cell-reference, action, empty", () => {
    expect(HistoryHash.join(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell", SpreadsheetCellReference.parse("D4"), "edit-5", ""]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell/D4/edit-5/");
});