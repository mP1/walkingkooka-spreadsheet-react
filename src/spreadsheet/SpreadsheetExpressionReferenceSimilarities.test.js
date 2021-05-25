import systemObjectTesting from "../SystemObjectTesting.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetLabelMapping from "./reference/SpreadsheetLabelMapping.js";
import SpreadsheetLabelName from "./reference/SpreadsheetLabelName.js";

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
    return new SpreadsheetExpressionReferenceSimilarities(cellReference(), labelsMappings());
}

systemObjectTesting(
    similarity(),
    new SpreadsheetExpressionReferenceSimilarities(SpreadsheetCellReference.fromJson("Z99"), labelsMappings()),
    SpreadsheetExpressionReferenceSimilarities.fromJson,
    "Missing json",
    "spreadsheet-expression-reference-similarities",
    {
        "cell-reference": cellReference().toJson(),
        "labels": [
            labelMapping1().toJson(),
            labelMapping2().toJson(),
        ],
    }
);
// create...............................................................................................................

test("create invalid cell-reference fails", () => {
    const r = true;
    const l = labelsMappings();
    expect(() => new SpreadsheetExpressionReferenceSimilarities(r, l)).toThrow("Expected SpreadsheetCellReference or nothing cellReference got true");
});

test("create missing labels fails", () => {
    const r = cellReference();
    const l = null;
    expect(() => new SpreadsheetExpressionReferenceSimilarities(r, l)).toThrow("Missing labels");
});

test("create invalid type labels fails", () => {
    const r = cellReference();
    const l = true;
    expect(() => new SpreadsheetExpressionReferenceSimilarities(r, l)).toThrow("Expected array labels got true");
});

test("create missing reference", () => {
    const r = undefined;
    const l = labelsMappings();

    check(new SpreadsheetExpressionReferenceSimilarities(r, l),
        r,
        l);
});

test("create empty labels", () => {
    const r = cellReference();
    const l = [];

    check(new SpreadsheetExpressionReferenceSimilarities(r, l),
        r,
        l);
});

// json

test("fromJson null fails", () => {
    expect(() => SpreadsheetExpressionReferenceSimilarities.fromJson(null)).toThrow("Missing json");
});

test("from json", () => {
    const r = cellReference();
    const l = labelsMappings();

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "cell-reference": r.toJson(),
            "labels": l.map(l => l.toJson()),
        }),
        r,
        l
    );
});

test("from json missing reference", () => {
    const r = undefined;
    const l = labelsMappings();

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "labels": l.map(l => l.toJson()),
        }),
        r,
        l
    );
});

test("from json missing labels", () => {
    const r = cellReference();
    const l = [];

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "cell-reference": r.toJson(),
        }),
        r,
        l
    );
});

test("from json empty labels", () => {
    const r = cellReference();
    const l = [];

    check(SpreadsheetExpressionReferenceSimilarities.fromJson({
            "cell-reference": r.toJson(),
            "labels": [],
        }),
        r,
        l
    );
});

// equals...............................................................................................................

test("equals both missing cell-reference", () => {
    const r = null;
    const l = labelsMappings();

    expect(new SpreadsheetExpressionReferenceSimilarities(r, l)
        .equals(new SpreadsheetExpressionReferenceSimilarities(r, l)))
        .toBeTrue();
});

test("equals missing cell-reference", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(null, labelsMappings()))
    ).toBeFalse();
});

test("equals different cell-reference", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(SpreadsheetCellReference.fromJson("B99"), labelsMappings()))
    ).toBeFalse();
});

test("equals different labels", () => {
    expect(similarity().equals(new SpreadsheetExpressionReferenceSimilarities(cellReference(), [labelMapping2()])))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(similarities, cellReference, labels) {
    expect(similarities.cellReference()).toStrictEqual(cellReference);
    expect(similarities.labels()).toStrictEqual(labels);
}