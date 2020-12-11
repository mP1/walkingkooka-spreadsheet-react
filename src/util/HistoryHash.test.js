import HistoryHash from "./HistoryHash.js";
import SpreadsheetName from "../spreadsheet/SpreadsheetName.js";
import SpreadsheetCellReference from "../spreadsheet/reference/SpreadsheetCellReference.js";


// parse..................................................................................................................

test("parse undefined", () => {
    expect(HistoryHash.parse())
        .toStrictEqual({});
});

test("parse empty", () => {
    expect(HistoryHash.parse(""))
        .toStrictEqual({});
});

test("parse missing leading slash", () => {
    expect(HistoryHash.parse("spreadsheet1/spreadsheet-name-2"))
        .toStrictEqual({});
});

test("parse slash", () => {
    expect(HistoryHash.parse("/"))
        .toStrictEqual({
            spreadsheetId: undefined,
            spreadsheetName: undefined,
            target: undefined,
        });
});

test("parse spreadsheetId", () => {
    expect(HistoryHash.parse("/123"))
        .toStrictEqual({
            spreadsheetId: "123",
            spreadsheetName: undefined,
            target: undefined,
        });
});

test("parse spreadsheetId/spreadsheetname", () => {
    expect(HistoryHash.parse("/1/spreadsheet-name-2"))
        .toStrictEqual({
            spreadsheetId: "1",
            spreadsheetName: "spreadsheet-name-2",
            target: undefined,
        });
});

test("parse spreadsheetId/spreadsheetname/", () => {
    expect(HistoryHash.parse("/1/spreadsheet-name-2/"))
        .toStrictEqual({
            spreadsheetId: "1",
            spreadsheetName: "spreadsheet-name-2",
            target: undefined,
        });
});

test("parse spreadsheetId/spreadsheetname/cell", () => {
    expect(HistoryHash.parse("/1/spreadsheet-name-2/cell/"))
        .toStrictEqual({
            spreadsheetId: "1",
            spreadsheetName: "spreadsheet-name-2",
            target: "cell",
            cellReference: undefined,
            action: undefined,
        });
});

test("parse spreadsheetId/spreadsheetname/cell/cell-reference", () => {
    expect(HistoryHash.parse("/1/spreadsheet-name-2/cell/cell-4/"))
        .toStrictEqual({
            spreadsheetId: "1",
            spreadsheetName: "spreadsheet-name-2",
            target: "cell",
            cellReference: "cell-4",
            action: undefined,
        });
});

test("parse spreadsheetId/spreadsheetname/cell/cell-reference/action", () => {
    expect(HistoryHash.parse("/1/spreadsheet-name-2/cell/cell-4/action-5"))
        .toStrictEqual({
            spreadsheetId: "1",
            spreadsheetName: "spreadsheet-name-2",
            target: "cell",
            cellReference: "cell-4",
            action: "action-5",
        });
});

test("parse spreadsheetId/spreadsheetname/target/cell/cell-reference/action/extra", () => {
    expect(HistoryHash.parse("/1/spreadsheet-name-2/cell/cell-4/action-5/extra-6"))
        .toStrictEqual({
            spreadsheetId: "1",
            spreadsheetName: "spreadsheet-name-2",
            target: "cell",
            cellReference: "cell-4",
            action: "action-5",
        });
});

test("parse spreadsheetId/spreadsheetname/unknown/unknown", () => {
    expect(HistoryHash.parse("/1/spreadsheet-name-2/unknown-3/unknown-4"))
        .toStrictEqual({
            spreadsheetId: "1",
            spreadsheetName: "spreadsheet-name-2",
            target: "unknown-3",
        });
});

// parse..................................................................................................................

test("concat undefined tokens fails", () => {
    expect(() => HistoryHash.concat()).toThrow("Missing tokens");
});

test("concat null tokens fails", () => {
    expect(() => HistoryHash.concat()).toThrow("Missing tokens");
});

test("concat tokens contains undefined fails", () => {
    expect(() => HistoryHash.concat([undefined])).toThrow("Invalid tokens contains missing token ");
});

test("concat tokens contains null fails", () => {
    expect(() => HistoryHash.concat([null])).toThrow("Invalid tokens contains missing token ");
});

test("concat tokens contains invalid fails", () => {
    expect(() => HistoryHash.concat(["valid-1", null])).toThrow("Invalid tokens contains missing token ");
});

test("concat tokens empty", () => {
    expect(HistoryHash.concat([]))
        .toStrictEqual("/");
});

test("concat tokens spreadsheet-id", () => {
    expect(HistoryHash.concat(["spreadsheet-1"]))
        .toStrictEqual("/spreadsheet-1");
});

test("concat tokens spreadsheet-id, spreadsheet-name", () => {
    expect(HistoryHash.concat(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2")]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2");
});

test("concat tokens spreadsheet-id, spreadsheet-name, cell", () => {
    expect(HistoryHash.concat(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell");
});

test("concat tokens spreadsheet-id, spreadsheet-name, cell, cell-reference", () => {
    expect(HistoryHash.concat(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell", SpreadsheetCellReference.parse("D4")]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell/D4");
});

test("concat tokens spreadsheet-id, spreadsheet-name, cell, cell-reference, action", () => {
    expect(HistoryHash.concat(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell", SpreadsheetCellReference.parse("D4"), "edit-5"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell/D4/edit-5");
});

test("concat tokens spreadsheet-id, spreadsheet-name, cell, cell-reference, action, extra", () => {
    expect(HistoryHash.concat(["spreadsheet-1", new SpreadsheetName("spreadsheet-name-2"), "cell", SpreadsheetCellReference.parse("D4"), "edit-5", "extra-6"]))
        .toStrictEqual("/spreadsheet-1/spreadsheet-name-2/cell/D4/edit-5/extra-6");
});