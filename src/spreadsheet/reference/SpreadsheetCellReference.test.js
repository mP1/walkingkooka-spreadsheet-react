import SpreadsheetCellReference from "./SpreadsheetCellReference";

const reference = "A1";

test("create without reference fails", () => {
    expect(() => new SpreadsheetCellReference(null)).toThrow("Missing reference");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetCellReference(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const spreadsheetCellReference = new SpreadsheetCellReference(reference);
    expect(spreadsheetCellReference.reference()).toBe(reference);
});

test("fromJson null fails", () => {
    expect(() => SpreadsheetCellReference.fromJson(null)).toThrow("Missing reference");
});

test("json", () => {
    const spreadsheetCellReference = new SpreadsheetCellReference(reference);

    check(spreadsheetCellReference, reference);
});

// helpers..............................................................................................................

function check(spreadsheetCellReference, reference) {
    expect(spreadsheetCellReference.reference()).toStrictEqual(reference);
    expect(spreadsheetCellReference.reference()).toBeString();

    expect(spreadsheetCellReference.toJson()).toStrictEqual(reference);
    expect(spreadsheetCellReference.toString()).toBe(reference);

    expect(SpreadsheetCellReference.parse(spreadsheetCellReference.toJson())).toStrictEqual(spreadsheetCellReference);
    expect(SpreadsheetCellReference.fromJson(spreadsheetCellReference.toJson())).toStrictEqual(spreadsheetCellReference);
}
