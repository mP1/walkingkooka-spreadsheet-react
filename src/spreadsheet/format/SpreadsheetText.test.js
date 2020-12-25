import Color from "../../color/Color.js";
import SpreadsheetText from "./SpreadsheetText";

function color() {
    return Color.parse("#123456");
}

function text() {
    return "Hello";
}

function spreadsheetText() {
    return new SpreadsheetText(color(), text());
}

test("create invalid color type fails", () => {
    const color = 123;
    expect(() => new SpreadsheetText(color, text())).toThrow("Expected Color color got " + color);
});

test("create without text fails", () => {
    expect(() => new SpreadsheetText(color(), text()).toThrow("Missing text"));
});

test("create invalid text type fails", () => {
    const text = 123;
    expect(() => new SpreadsheetText(color(), text)).toThrow("Expected string text got " + text);
});

test("create without color & text", () => {
    const c = undefined;
    const t = text();
    check(new SpreadsheetText(c, t),
        c,
        t);
});

test("create color & text", () => {
    const c = color();
    const t = text();
    check(new SpreadsheetText(c, t),
        c,
        t);
});

// fromJson.............................................................................................................

test("fromJson undefined fails", () => {
    expect(() => SpreadsheetText.fromJson(undefined)).toThrow("Missing json");
});

test("fromJson null fails", () => {
    expect(() => SpreadsheetText.fromJson(null)).toThrow("Missing json");
});

test("fromJson non object fails", () => {
    expect(() => SpreadsheetText.fromJson("invalid!")).toThrow("Expected object got invalid!");
});

test("fromJson without color and text", () => {
    const t = text();

    const spreadsheetText = SpreadsheetText.fromJson({
        text: t,
    })

    check(spreadsheetText, undefined, t);
});

test("fromJson with color and text", () => {
    const c = color();
    const t = text();

    const spreadsheetText = SpreadsheetText.fromJson({
        color: c,
        text: t,
    })

    check(spreadsheetText, c, t);
});

// toJson...............................................................................................................

test("toJson without color and text", () => {
    const c = undefined;
    const t = text();

    expect(new SpreadsheetText(c, t)
        .toJson()).toStrictEqual({
        text: t,
    });
});

test("toJson with color and text", () => {
    const c = color();
    const t = text();

    expect(new SpreadsheetText(c, t)
        .toJson()).toStrictEqual({
        color: c.toJson(),
        text: t,
    });
});

// equals...............................................................................................................

test("equals undefined false", () => {
    expect(spreadsheetText()
        .equals())
        .toBeFalse();
});

test("equals null false", () => {
    expect(spreadsheetText()
        .equals(null))
        .toBeFalse();
});

test("equals different type false", () => {
    expect(spreadsheetText()
        .equals("different"))
        .toBeFalse();
});

test("equals self true", () => {
    const t = spreadsheetText();
    expect(t.equals(t))
        .toBeTrue();
});

test("equals different color false", () => {
    expect(spreadsheetText()
        .equals(new SpreadsheetText(Color.parse("#987654"), text())))
        .toBeFalse();
});

test("equals different text false", () => {
    expect(spreadsheetText()
        .equals(new SpreadsheetText(color(), "different")))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(spreadsheetText, color, text) {
    expect(spreadsheetText.color()).toStrictEqual(color);
    expect(spreadsheetText.text()).toStrictEqual(text);
}