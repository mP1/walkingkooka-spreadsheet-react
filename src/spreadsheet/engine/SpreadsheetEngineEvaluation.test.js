import SpreadsheetEngineEvaluation from "./SpreadsheetEngineEvaluation";

// tests................................................................................................................

test("valueof missing text fails", () => {
    expect(() => SpreadsheetEngineEvaluation.valueOf()).toThrow("Missing text");
});

test("valueof invalid text type fails", () => {
    expect(() => SpreadsheetEngineEvaluation.valueOf(12.5)).toThrow("Expected string text got 12.5");
});

test("valueof unknown fails", () => {
    expect(() => SpreadsheetEngineEvaluation.valueOf("?123")).toThrow("Unknown enum got ?123");
});

test("valueof CLEAR_VALUE_ERROR_SKIP_EVALUATE", () => {
    const v = SpreadsheetEngineEvaluation.CLEAR_VALUE_ERROR_SKIP_EVALUATE;
    expect(SpreadsheetEngineEvaluation.valueOf(v.value)).toEqual(v);
});

test("valueof SKIP_EVALUATE", () => {
    const v = SpreadsheetEngineEvaluation.SKIP_EVALUATE;
    expect(SpreadsheetEngineEvaluation.valueOf(v.value)).toEqual(v);
});

test("toString CLEAR_VALUE_ERROR_SKIP_EVALUATE", () => {
    expect(SpreadsheetEngineEvaluation.CLEAR_VALUE_ERROR_SKIP_EVALUATE.toString()).toEqual("clear-value-error-skip-evaluate");
});

test("toString SKIP_EVALUATE", () => {
    expect(SpreadsheetEngineEvaluation.SKIP_EVALUATE.toString()).toEqual("skip-evaluate");
});

