import Locale from "./Locale";
import systemObjectTesting from "../SystemObjectTesting.js";

const text = "EN-AU";

systemObjectTesting(
    new Locale(text),
    new Locale("EN-NZ"),
    Locale.fromJson,
    "Missing text",
    "locale",
    text
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new Locale(null)).toThrow("Missing text");
});

test("create null text fails", () => {
    expect(() => new Locale(null)).toThrow("Missing text");
});

test("create with non string text fails", () => {
    expect(() => new Locale(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const locale = new Locale(text);
    expect(locale.text()).toBe(text);
});

test("create empty", () => {
    const t = "";
    const locale = new Locale(t);
    expect(locale.text()).toBe(t);
});

// fromJson.............................................................................................................

test("fromJson empty string", () => {
    expect(() => Locale.fromJson(null)).toThrow("Missing text");
});

test("fromJson string", () => {
    const text = "2000-01-01 12:58:59";
    check(Locale.fromJson(text), text);
});

// equals...............................................................................................................

test("equals equivalent true #2", () => {
    const text = "different@example.com";
    const e = new Locale(text);
    expect(e.equals(new Locale(text))).toBeTrue();
});

// helpers..............................................................................................................

function check(locale, text) {
    expect(locale.text()).toStrictEqual(text);
    expect(locale.text()).toBeString();

    expect(locale.toJson()).toStrictEqual(text);
    expect(locale.toString()).toBe(text);
    expect(Locale.fromJson(locale.toJson())).toStrictEqual(locale);
}
