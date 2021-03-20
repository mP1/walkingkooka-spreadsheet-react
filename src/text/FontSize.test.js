import FontSize from "./FontSize";
import systemObjectTesting from "../SystemObjectTesting.js";

const VALUE = 14;

function fontSize() {
    return FontSize.fromJson(VALUE);
}

systemObjectTesting(
    fontSize(),
    new FontSize(999),
    FontSize.fromJson,
    "Missing value",
    "font-size",
    VALUE
);

test("fromJson null fails", () => {
    expect(() => FontSize.fromJson(null)).toThrow("Missing value");
});

test("fromJson boolean fails", () => {
    expect(() => FontSize.fromJson(true)).toThrow("Expected number got true");
});

test("fromJson zero fails", () => {
    expect(() => FontSize.fromJson(0)).toThrow("Expected number > 0 got 0");
});

test("fromJson -1 fails", () => {
    expect(() => FontSize.fromJson(-1)).toThrow("Expected number > 0 got -1");
});

test("fromJson string fails", () => {
    expect(() => FontSize.fromJson("!invalid")).toThrow("Expected number got !invalid");
});

test("create", () => {
    check(new FontSize(VALUE), VALUE);
});

// equals...............................................................................................................

test("equals equivalent true", () => {
    const fontSize = new FontSize(VALUE);
    expect(fontSize.equals(new FontSize(VALUE))).toBeTrue();
});

// helpers..............................................................................................................

function check(fontSize, value) {
    expect(fontSize.value()).toStrictEqual(value);

    const json = value;
    expect(fontSize.toJson()).toStrictEqual(json);
    expect(fontSize.toString()).toStrictEqual(json);

    expect(FontSize.fromJson(fontSize.toJson())).toStrictEqual(fontSize);
}
