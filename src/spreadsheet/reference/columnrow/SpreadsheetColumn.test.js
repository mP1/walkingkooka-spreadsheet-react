import SpreadsheetColumn from "./SpreadsheetColumn.js";
import SpreadsheetColumnReference from "./SpreadsheetColumnReference.js";
import systemObjectTesting from "../../../SystemObjectTesting.js";

function reference() {
    return SpreadsheetColumnReference.parse("B");
}

function hidden() {
    return true;
}

function json() {
    return {
        "B": {
            hidden: hidden(),
        },
    };
}

systemObjectTesting(
    new SpreadsheetColumn(reference(), hidden()),
    new SpreadsheetColumn(SpreadsheetColumnReference.parse("Z"), hidden()),
    SpreadsheetColumn.fromJson,
    "Missing json",
    "spreadsheet-column",
    json()
);

// create...............................................................................................................

test("create without reference fails", () => {
    expect(() => new SpreadsheetColumn(null, hidden()))
        .toThrow("Missing reference");
});

test("create without hidden fails", () => {
    expect(() => new SpreadsheetColumn(reference(), null))
        .toThrow("Missing hidden");
});

test("create", () => {
    check(
        new SpreadsheetColumn(
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
    expect(() => SpreadsheetColumn.fromJson({
    })).toThrow("Missing reference");
});

test("from missing hidden fails", () => {
    expect(() => SpreadsheetColumn.fromJson({
        "B": {

        }
    })).toThrow("Missing hidden");
});

test("fromJson", () => {
    const column = SpreadsheetColumn.fromJson(json());
    check(
        column,
        reference(),
        hidden(),
        json()
    );
});

// patch................................................................................................................

function testPatchAndCheck(column, property, value, expected) {
    test("testPatchAndCheck " + column + " " + property + " " + value,
        () => {
            expect(
                column
                    .patch(property, value)
            ).toStrictEqual(expected);
        }
    );
}

testPatchAndCheck(
    new SpreadsheetColumn(reference(), false),
    "hidden",
    true,
    new SpreadsheetColumn(reference(), true)
);

testPatchAndCheck(
    new SpreadsheetColumn(reference(), true),
    "hidden",
    false,
    new SpreadsheetColumn(reference(), false)
);

function check(column, reference, hidden, json) {
    expect(column.reference()).toStrictEqual(reference);
    expect(column.reference()).toBeInstanceOf(SpreadsheetColumnReference);

    expect(column.hidden()).toStrictEqual(hidden);
    expect(column.hidden()).toBeBoolean();

    expect(column.toJson()).toStrictEqual(json);
    expect(SpreadsheetColumn.fromJson(json)).toStrictEqual(column);

    expect(column.toString()).toStrictEqual(JSON.stringify(json));
}