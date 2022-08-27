import systemObjectTesting from "../SystemObjectTesting.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetLabelMapping from "./reference/label/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./reference/label/SpreadsheetLabelName.js";

const CELL_REFERENCE_TEXT = "B2";

function cellReference() {
    return SpreadsheetCellReference.fromJson(CELL_REFERENCE_TEXT);
}

const LABEL1_TEXT = "Label123";

function label1() {
    return SpreadsheetLabelName.parse(LABEL1_TEXT);
}

function labelMapping1() {
    return SpreadsheetLabelMapping.fromJson({
        label: label1().toJson(),
        reference: "C3",
    });
}

const LABEL2_TEXT = "Label456";

function label2() {
    return SpreadsheetLabelName.parse(LABEL2_TEXT);
}

function labelMapping2() {
    return SpreadsheetLabelMapping.fromJson({
        label: label2().toJson(),
        reference: "D4",
    });
}

function labelsMappings() {
    return [
        labelMapping1(),
        labelMapping2(),
    ];
}

function similarity() {
    return new SpreadsheetExpressionReferenceSimilarities(cellReference(), label1(), labelsMappings());
}

systemObjectTesting(
    similarity(),
    new SpreadsheetExpressionReferenceSimilarities(SpreadsheetCellReference.fromJson("Z99"), label2(), labelsMappings()),
    SpreadsheetExpressionReferenceSimilarities.fromJson,
    "Missing json",
    "spreadsheet-expression-reference-similarities",
    {
        "cell-reference": cellReference().toJson(),
        "label": label1().toJson(),
        "label-mappings": [
            labelMapping1().toJson(),
            labelMapping2().toJson(),
        ],
    }
);
// create...............................................................................................................

test("create invalid cell-reference fails", () => {
    const r = true;
    const l = label1();
    const m = labelsMappings();
    expect(() => new SpreadsheetExpressionReferenceSimilarities(r, l, m)).toThrow("Expected SpreadsheetCellReference or nothing cellReference got true");
});

test("create missing labels fails", () => {
    const r = cellReference();
    const l = label1();
    const m = null;
    expect(() => new SpreadsheetExpressionReferenceSimilarities(r, l, m)).toThrow("Missing labelMappings");
});

test("create invalid type labels fails", () => {
    const r = cellReference();
    const l = label1();
    const m = true;
    expect(() => new SpreadsheetExpressionReferenceSimilarities(r, l, m)).toThrow("Expected array labelMappings got true");
});

test("create missing reference", () => {
    const r = undefined;
    const l = label1();
    const m = labelsMappings();

    check(new SpreadsheetExpressionReferenceSimilarities(r, l, m),
        r,
        l,
        m);
});

test("create empty labelMappings", () => {
    const r = cellReference();
    const l = label1();
    const m = [];

    check(new SpreadsheetExpressionReferenceSimilarities(r, l, m),
        r,
        l,
        m);
});

// json

test("fromJson null fails", () => {
    expect(() => SpreadsheetExpressionReferenceSimilarities.fromJson(null)).toThrow("Missing json");
});

test("from json", () => {
    const r = cellReference();
    const l = label1();
    const m = labelsMappings();

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "cell-reference": r.toJson(),
            "label": l.toJson(),
            "label-mappings": m.map(l => l.toJson()),
        }),
        r,
        l,
        m
    );
});

test("from json only mappings", () => {
    const r = undefined;
    const l = undefined;
    const m = labelsMappings();

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "label-mappings": m.map(l => l.toJson()),
        }),
        r,
        l,
        m
    );
});

test("from json missing mappings", () => {
    const r = cellReference();
    const l = undefined;
    const m = [];

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "cell-reference": r.toJson(),
        }),
        r,
        l,
        m
    );
});

test("from json empty label-mappings", () => {
    const r = cellReference();
    const l = label1();
    const m = [];

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "cell-reference": r.toJson(),
            "label": l.toJson(),
            "label-mappings": [],
        }),
        r,
        l,
        m
    );
});

// equals...............................................................................................................

test("equals both missing cell-reference", () => {
    const r = null;
    const l = label1();
    const m = labelsMappings();

    expect(new SpreadsheetExpressionReferenceSimilarities(r, l, m)
        .equals(new SpreadsheetExpressionReferenceSimilarities(r, l, m)))
        .toBeTrue();
});

test("equals missing cell-reference", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(null, label1(), labelsMappings()))
    ).toBeFalse();
});

test("equals different cell-reference", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(SpreadsheetCellReference.fromJson("B99"), label1(), labelsMappings()))
    ).toBeFalse();
});

test("equals missing label", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(cellReference(), null, labelsMappings()))
    ).toBeFalse();
});

test("equals different label", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(cellReference(), label2(), labelsMappings()))
    ).toBeFalse();
});

test("equals different label-mappings", () => {
    expect(similarity().equals(new SpreadsheetExpressionReferenceSimilarities(cellReference(), label1(), [labelMapping2()])))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(similarities, cellReference, label, labelMappings) {
    expect(similarities.cellReference()).toStrictEqual(cellReference);
    expect(similarities.label()).toStrictEqual(label);
    expect(similarities.labelMappings()).toStrictEqual(labelMappings);
}