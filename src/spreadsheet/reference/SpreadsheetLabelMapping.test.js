import SpreadsheetCellRange from "./SpreadsheetCellRange.js";
import SpreadsheetCellReference from "./SpreadsheetCellReference.js";
import SpreadsheetExpressionReference from "./SpreadsheetExpressionReference.js";
import SpreadsheetLabelName from "./SpreadsheetLabelName.js";
import SpreadsheetLabelMapping from "./SpreadsheetLabelMapping.js";
import systemObjectTesting from "../../SystemObjectTesting.js";

function label() {
    return SpreadsheetLabelName.parse("Label123");
};

function reference() {
    return SpreadsheetCellReference.parse("A1");
};

systemObjectTesting(
    new SpreadsheetLabelMapping(label(), reference()),
    new SpreadsheetLabelMapping(
        SpreadsheetLabelName.parse("DifferentLabel"),
        SpreadsheetCellReference.parse("Z9")
    ),
    SpreadsheetLabelMapping.fromJson,
    "Missing json",
    "spreadsheet-label-mapping",
    {
        label: label().toJson(),
        reference: reference().toJson(),
    }
);

// create...............................................................................................................

test("create without label fails", () => {
    expect(() => new SpreadsheetLabelMapping(null, reference())).toThrow("Missing label");
});

test("create with non SpreadsheetLabelName fails", () => {
    expect(() => new SpreadsheetLabelMapping(1.5, reference())).toThrow("Expected SpreadsheetLabelName label got 1.5");
});

test("create without reference fails", () => {
    expect(() => new SpreadsheetLabelMapping(label())).toThrow("Missing reference");
});

test("create with non SpreadsheetExpressionReference fails", () => {
    expect(() => new SpreadsheetLabelMapping(label(), 1.5)).toThrow("Expected SpreadsheetExpressionReference reference got 1.5");
});

test("create with same label and reference fails", () => {
    const l = label();
    expect(() => new SpreadsheetLabelMapping(l, l)).toThrow("Reference \"Label123\" must be different to label \"Label123\"");
});

test("create Cell", () => {
    const l = label();
    const r = SpreadsheetCellReference.fromJson("A1")
    const mapping = new SpreadsheetLabelMapping(l, r);

    check(
        mapping,
        l,
        r
    );
});

test("create Label", () => {
    const l = label();
    const r = SpreadsheetLabelName.fromJson("Different")
    const mapping = new SpreadsheetLabelMapping(l, r);

    check(
        mapping,
        l,
        r
    );
});

test("create Range", () => {
    const l = label();
    const r = SpreadsheetCellRange.fromJson("A1:B2")
    const mapping = new SpreadsheetLabelMapping(l, r);

    check(
        mapping,
        l,
        r
    );
});

// fromJson.............................................................................................................

test("fromJson label/cellReference", () => {
    const reference = SpreadsheetCellReference.parse("A1");

    check(
        SpreadsheetLabelMapping.fromJson({
            label: label().toJson(),
            reference: reference.toJson(),
        }),
        label(),
        reference
    );
});

test("fromJson label/label", () => {
    const reference = SpreadsheetLabelName.fromJson("different");

    check(
        SpreadsheetLabelMapping.fromJson({
            label: label().toJson(),
            reference: reference.toJson(),
        }),
        label(),
        reference
    );
});

test("fromJson label/range", () => {
    const reference = SpreadsheetCellRange.fromJson("A1:B2");

    check(
        SpreadsheetLabelMapping.fromJson({
            label: label().toJson(),
            reference: reference.toJson(),
        }),
        label(),
        reference
    );
});

// toJson.............................................................................................................

test("toJson label/cell", () => {
    expect(
        new SpreadsheetLabelMapping(label(), SpreadsheetCellReference.fromJson("A1")).toJson()
    ).toStrictEqual({
        label: label().toJson(),
        reference: "A1",
    });
});

test("toJson label/label", () => {
    expect(
        new SpreadsheetLabelMapping(label(), SpreadsheetLabelName.fromJson("Different")).toJson()
    ).toStrictEqual({
        label: label().toJson(),
        reference: "Different",
    });
});

test("toJson label/range", () => {
    expect(
        new SpreadsheetLabelMapping(label(), SpreadsheetCellRange.fromJson("A1:B2")).toJson()
    ).toStrictEqual({
        label: label().toJson(),
        reference: "A1:B2",
    });
});

// toSpreadsheetSelectWidgetOption....................................................................................

test("toSpreadsheetSelectWidgetOption", () => {
    const label = SpreadsheetLabelName.parse("Label123");
    const reference = SpreadsheetCellReference.parse("B99");

    expect(label.mapping(reference).toSpreadsheetSelectWidgetOption()).toStrictEqual({
        text: label.toString(),
        createLabel: null,
        editLabel: label,
        gotoCellOrLabel: reference,
    });
});

// equals................................................................................................................

test("equals different label false", () => {
    expect(new SpreadsheetLabelMapping(label(), reference()).equals(new SpreadsheetLabelMapping(new SpreadsheetLabelName("Different"), reference()))).toStrictEqual(false);
});

test("equals different reference false", () => {
    expect(new SpreadsheetLabelMapping(label(), reference()).equals(new SpreadsheetLabelMapping(label(), SpreadsheetCellReference.parse("Z99")))).toStrictEqual(false);
});

test("equals label/SpreadsheetCellReference", () => {
    const reference = SpreadsheetCellReference.parse("A1");
    expect(new SpreadsheetLabelMapping(label(), reference).equals(new SpreadsheetLabelMapping(label(), reference))).toStrictEqual(true);
});

test("equals label/SpreadsheetLabel", () => {
    const reference = SpreadsheetLabelName.parse("Different");
    expect(new SpreadsheetLabelMapping(label(), reference).equals(new SpreadsheetLabelMapping(label(), reference))).toStrictEqual(true);
});

test("equals label/SpreadsheetCellRange", () => {
    const reference = SpreadsheetCellRange.parse("A1:B2");
    expect(new SpreadsheetLabelMapping(label(), reference).equals(new SpreadsheetLabelMapping(label(), reference))).toStrictEqual(true);
});

// helpers..............................................................................................................

function check(mapping,
               label,
               reference) {
    expect(mapping.label()).toStrictEqual(label);
    expect(mapping.label()).toBeInstanceOf(SpreadsheetLabelName);

    expect(mapping.reference()).toStrictEqual(reference);
    expect(mapping.reference()).toBeInstanceOf(SpreadsheetExpressionReference);
}
