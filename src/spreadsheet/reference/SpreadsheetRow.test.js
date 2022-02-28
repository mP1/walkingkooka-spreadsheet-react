import SpreadsheetRow from "./SpreadsheetRow.js";
import SpreadsheetRowReference from "./SpreadsheetRowReference.js";
import systemObjectTesting from "../../SystemObjectTesting.js";

function reference() {
    return SpreadsheetRowReference.parse("2");
}

function hidden() {
    return true;
}

function json() {
    return {
        "2": {
            hidden: hidden(),
        },
    };
}

systemObjectTesting(
    new SpreadsheetRow(reference(), hidden()),
    new SpreadsheetRow(SpreadsheetRowReference.parse("999"), hidden()),
    SpreadsheetRow.fromJson,
    "Missing json",
    "spreadsheet-row",
    json()
);

// create...............................................................................................................

test("create without reference fails", () => {
    expect(() => new SpreadsheetRow(null, hidden()))
        .toThrow("Missing reference");
});

test("create without hidden fails", () => {
    expect(() => new SpreadsheetRow(reference(), null))
        .toThrow("Missing hidden");
});

test("create", () => {
    check(
        new SpreadsheetRow(
            reference(),
            hidden()
        ),
        reference(),
        hidden(),
        json()
    );
});

// fromJson.............................................................................................................

test("from missing reference fails", () => {
    expect(() => SpreadsheetRow.fromJson({})).toThrow("Missing reference");
});

test("from missing hidden fails", () => {
    expect(() => SpreadsheetRow.fromJson({
        "2": {}
    })).toThrow("Missing hidden");
});

test("fromJson", () => {
    const column = SpreadsheetRow.fromJson(json());
    check(
        column,
        reference(),
        hidden(),
        json()
    );
});

// patch................................................................................................................

function testPatchAndCheck(row, property, value, expected) {
    test("testPatchAndCheck " + row + " " + property + " " + value,
        () => {
            expect(
                row
                    .patch(property, value)
            ).toStrictEqual(expected);
        }
    );
}

testPatchAndCheck(
    new SpreadsheetRow(reference(), false),
    "hidden",
    true,
    new SpreadsheetRow(reference(), true)
);

testPatchAndCheck(
    new SpreadsheetRow(reference(), true),
    "hidden",
    false,
    new SpreadsheetRow(reference(), false)
);

function check(column, reference, hidden, json) {
    expect(column.reference()).toStrictEqual(reference);
    expect(column.reference()).toBeInstanceOf(SpreadsheetRowReference);

    expect(column.hidden()).toStrictEqual(hidden);
    expect(column.hidden()).toBeBoolean();

    expect(column.toJson()).toStrictEqual(json);
    expect(SpreadsheetRow.fromJson(json)).toStrictEqual(column);

    expect(column.toString()).toStrictEqual(JSON.stringify(json));
}