import SpreadsheetReferenceKind from "./SpreadsheetReferenceKind";
import systemObjectTesting from "../../SystemObjectTesting.js";

systemObjectTesting(
    SpreadsheetReferenceKind.ABSOLUTE,
    SpreadsheetReferenceKind.RELATIVE,
    SpreadsheetReferenceKind.fromJson,
    "Missing name",
    "spreadsheet-reference-kind",
    "ABSOLUTE"
);

valueOfAndCheck("ABSOLUTE", SpreadsheetReferenceKind.ABSOLUTE);
valueOfAndCheck("RELATIVE", SpreadsheetReferenceKind.RELATIVE);

function valueOfAndCheck(name, kind) {
    test("valueOf " + name, () => {
        expect(SpreadsheetReferenceKind.valueOf(name)).toStrictEqual(kind);
    });
}

test("prefix ABSOLUTE", () => {
    expect(SpreadsheetReferenceKind.ABSOLUTE.prefix()).toStrictEqual("$");
});

test("prefix RELATIVE", () => {
    expect(SpreadsheetReferenceKind.RELATIVE.prefix()).toStrictEqual("");
});

// equals................................................................................................................

test("equals ABSOLUTE true", () => {
    expect(SpreadsheetReferenceKind.ABSOLUTE.equals(SpreadsheetReferenceKind.ABSOLUTE)).toStrictEqual(true);
});

test("equals ABSOLUTE & RELATIVE false", () => {
    expect(SpreadsheetReferenceKind.ABSOLUTE.equals(SpreadsheetReferenceKind.RELATIVE)).toStrictEqual(false);
});

test("equals RELATIVE true", () => {
    expect(SpreadsheetReferenceKind.RELATIVE.equals(SpreadsheetReferenceKind.RELATIVE)).toStrictEqual(true);
});

// toString.............................................................................................................

test("toString", () => {
    expect(SpreadsheetReferenceKind.valueOf("RELATIVE").name()).toStrictEqual("RELATIVE");
});

