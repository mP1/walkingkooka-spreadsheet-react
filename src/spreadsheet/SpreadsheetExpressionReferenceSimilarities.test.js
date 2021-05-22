import systemObjectTesting from "../SystemObjectTesting.js";
import SpreadsheetCellReference from "./reference/SpreadsheetCellReference.js";
import SpreadsheetExpressionReferenceSimilarities from "./SpreadsheetExpressionReferenceSimilarities.js";
import SpreadsheetLabelMapping from "./reference/SpreadsheetLabelMapping.js";

function cellReference() {
    return SpreadsheetCellReference.fromJson("B2");
}

function labelMapping1() {
    return SpreadsheetLabelMapping.fromJson({
        label: "Label123",
        reference: "C3",
    });
}

function labelMapping2() {
    return SpreadsheetLabelMapping.fromJson({
        label: "Label456",
        reference: "D4",
    });
}

function labels() {
    return [
        labelMapping1(),
        labelMapping2(),
    ];
}

function similarity() {
    return new SpreadsheetExpressionReferenceSimilarities(cellReference(), labels());
}

systemObjectTesting(
    similarity(),
    new SpreadsheetExpressionReferenceSimilarities(SpreadsheetCellReference.fromJson("Z99"), labels()),
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
    const l = labels();
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
    const l = labels();

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
    const l = labels();

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
    const l = labels();

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
    const l = labels();

    expect(new SpreadsheetExpressionReferenceSimilarities(r, l)
        .equals(new SpreadsheetExpressionReferenceSimilarities(r, l)))
        .toBeTrue();
});

test("equals missing cell-reference", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(null, labels()))
    ).toBeFalse();
});

test("equals different cell-reference", () => {
    expect(similarity()
        .equals(new SpreadsheetExpressionReferenceSimilarities(SpreadsheetCellReference.fromJson("B99"), labels()))
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