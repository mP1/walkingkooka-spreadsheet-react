import SpreadsheetError from "./SpreadsheetError";
import SpreadsheetFormula from "./SpreadsheetFormula";
import SystemObject from "../SystemObject.js";
import systemObjectTesting from "../SystemObjectTesting.js";

const text = "###-123-abc";
const value = 1.5;

systemObjectTesting(
    new SpreadsheetFormula(text, value),
    new SpreadsheetFormula("99+99"),
    SpreadsheetFormula.fromJson,
    "Missing json",
    "spreadsheet-formula",
    {
        text: text,
        value: {
            type: "double",
            value: 1.5
        }
    }
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new SpreadsheetFormula(null)).toThrow("Missing text");
});

test("create with non string fails", () => {
    expect(() => new SpreadsheetFormula(1.5)).toThrow("Expected string text got 1.5");
});

test("create text", () => {
    const spreadsheetFormula = new SpreadsheetFormula(text);
    expect(spreadsheetFormula.text()).toBe(text);
});

test("create text empty", () => {
    const text = "";
    const spreadsheetFormula = new SpreadsheetFormula(text);
    expect(spreadsheetFormula.text()).toBe(text);
});

test("create text, value", () => {
    check(
        new SpreadsheetFormula(text, value),
        text,
        value,
        undefined,
        {
            text: text,
            value: SystemObject.toJsonWithType(value)
        }
    );
});

test("create text, error", () => {
    const error = new SpreadsheetError("Error message #1");

    check(new SpreadsheetFormula(text, undefined, error), text, undefined, error, {text: text, error: error.toJson()})
});

// text.................................................................................................................

test("text", () => {
    expect(new SpreadsheetFormula(text, value).text()).toStrictEqual(text);
});

test("setText missing fails", () => {
    expect(() => new SpreadsheetFormula(text).setText()).toThrow("Missing text");
});

test("setText non string fails", () => {
    expect(() => new SpreadsheetFormula(text).setText(1.5)).toThrow("Expected string text got 1.5");
});

test("setText same", () => {
    expect(new SpreadsheetFormula(text, value).setText(text)).toStrictEqual(new SpreadsheetFormula(text, value));
});

test("setText", () => {
    expect(new SpreadsheetFormula("before", value).setText(text)).toStrictEqual(new SpreadsheetFormula(text, value));
});

test("setText empty string", () => {
    const text = "";
    expect(new SpreadsheetFormula("before", value).setText(text)).toStrictEqual(new SpreadsheetFormula(text, value));
});

// json.................................................................................................................

test("json only text", () => {
    const spreadsheetFormula = new SpreadsheetFormula(text);

    check(
        spreadsheetFormula,
        text,
        undefined,
        undefined,
        {
            text: text
        }
    );
});

test("json text & value", () => {
    const spreadsheetFormula = new SpreadsheetFormula(text, value);

    check(
        spreadsheetFormula,
        text,
        value,
        undefined,
        {
            text: text,
            value: SystemObject.toJsonWithType(value),
        }
    );
});

test("json text & empty string value", () => {
    const value = "";
    const spreadsheetFormula = new SpreadsheetFormula(text, value);

    check(
        spreadsheetFormula,
        text,
        value,
        undefined,
        {
            text: text,
            value: SystemObject.toJsonWithType(value),
        }
    );
});

test("json text & error", () => {
    const error = new SpreadsheetError("Error message #1");
    const spreadsheetFormula = new SpreadsheetFormula(text, undefined, error);

    check(
        spreadsheetFormula,
        text,
        undefined,
        error,
        {
            text: text,
            error: error.toJson()
        }
    );
});

// helpers..............................................................................................................

function check(spreadsheetFormula, text, value, error, json) {
    expect(spreadsheetFormula.text()).toStrictEqual(text);
    expect(spreadsheetFormula.text()).toBeString();

    expect(spreadsheetFormula.value()).toStrictEqual(value);

    expect(spreadsheetFormula.error()).toStrictEqual(error);
    if(error){
        expect(spreadsheetFormula.error()).toBeInstanceOf(SpreadsheetError);
    }

    expect(spreadsheetFormula.toJson()).toStrictEqual(json);
    expect(spreadsheetFormula.toString()).toBe(JSON.stringify(json));

    expect(SpreadsheetFormula.fromJson(spreadsheetFormula.toJson())).toStrictEqual(spreadsheetFormula);
}
