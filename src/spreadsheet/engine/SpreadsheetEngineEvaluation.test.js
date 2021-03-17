import SpreadsheetEngineEvaluation from "./SpreadsheetEngineEvaluation";

// tests................................................................................................................

test("valueOf CLEAR_VALUE_ERROR_SKIP_EVALUATE", () => {
    const v = SpreadsheetEngineEvaluation.CLEAR_VALUE_ERROR_SKIP_EVALUATE;
    expect(SpreadsheetEngineEvaluation.valueOf(v.name())).toEqual(v);
});

test("valueOf SKIP_EVALUATE", () => {
    const v = SpreadsheetEngineEvaluation.SKIP_EVALUATE;
    expect(SpreadsheetEngineEvaluation.valueOf(v.name())).toEqual(v);
});

test("toString CLEAR_VALUE_ERROR_SKIP_EVALUATE", () => {
    expect(SpreadsheetEngineEvaluation.CLEAR_VALUE_ERROR_SKIP_EVALUATE.nameKebabCase()).toEqual("clear-value-error-skip-evaluate");
});

test("toString SKIP_EVALUATE", () => {
    expect(SpreadsheetEngineEvaluation.SKIP_EVALUATE.nameKebabCase()).toEqual("skip-evaluate");
});

