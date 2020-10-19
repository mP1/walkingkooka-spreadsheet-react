import SpreadsheetFormula, {fromJson} from "./SpreadsheetFormula";
import SpreadsheetError from "./SpreadsheetError";

const text = "###-123-abc";
const value = 1.5;

test("create without text fails", () => {
    expect(() => new SpreadsheetFormula(null)).toThrow("Text missing");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetFormula(1.5)).toThrow("Expected string got 1.5");
});

test("create text", () => {
    const spreadsheetFormula = new SpreadsheetFormula(text);
    expect(spreadsheetFormula.text()).toBe(text);
});

test("create text, value", () => {
    check(new SpreadsheetFormula(text, value), text, value, undefined, {text: text, value: value})
});

test("create text, error", () => {
    const error = new SpreadsheetError("Error message #1");

    check(new SpreadsheetFormula(text, undefined, error), text, undefined, error, {text: text, error: error.toJson()})
});

// json.................................................................................................................

test("fromJson null", () => {
    expect(() => fromJson(null)).toThrow("Json missing");
});

test("json only text", () => {
    const spreadsheetFormula = new SpreadsheetFormula(text);

    check(spreadsheetFormula, text, undefined, undefined, {text: text});
});

test("json text & value", () => {
    const spreadsheetFormula = new SpreadsheetFormula(text, value);

    check(spreadsheetFormula, text, value, undefined, {text: text, value: value});
});

test("json text & error", () => {
    const error = new SpreadsheetError("Error message #1");
    const spreadsheetFormula = new SpreadsheetFormula(text, undefined, error);

    check(spreadsheetFormula, text, undefined, error, {text: text, error: error.toJson()});
});

// helpers..............................................................................................................

function check(spreadsheetFormula, text, value, error, json) {
    expect(spreadsheetFormula.text()).toStrictEqual(text);
    expect(spreadsheetFormula.value()).toStrictEqual(value);
    expect(spreadsheetFormula.error()).toStrictEqual(error);

    expect(spreadsheetFormula.toJson()).toStrictEqual(json);
    expect(spreadsheetFormula.toString()).toBe(JSON.stringify(json));

    expect(fromJson(spreadsheetFormula.toJson())).toStrictEqual(spreadsheetFormula);
}
