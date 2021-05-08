import FontWeight from "./FontWeight";
import systemObjectTesting from "../SystemObjectTesting.js";

const VALUE = 14;

function fontWeight() {
    return FontWeight.fromJson(VALUE);
}

systemObjectTesting(
    fontWeight(),
    new FontWeight(999),
    FontWeight.fromJson,
    "Missing value",
    "font-weight",
    VALUE
);

test("fromJson null fails", () => {
    expect(() => FontWeight.fromJson(null)).toThrow("Missing value");
});

test("fromJson boolean fails", () => {
    expect(() => FontWeight.fromJson(true)).toThrow("Expected number value got true");
});

test("fromJson zero fails", () => {
    expect(() => FontWeight.fromJson(0)).toThrow("Expected number > 0 got 0");
});

test("fromJson -1 fails", () => {
    expect(() => FontWeight.fromJson(-1)).toThrow("Expected number > 0 got -1");
});

test("fromJson string fails", () => {
    expect(() => FontWeight.fromJson("!invalid")).toThrow("Expected number value got !invalid");
});

test("create", () => {
    check(new FontWeight(VALUE), VALUE);
});

// equals...............................................................................................................

test("equals equivalent true", () => {
    const fontWeight = new FontWeight(VALUE);
    expect(fontWeight.equals(new FontWeight(VALUE))).toBeTrue();
});

// helpers..............................................................................................................

function check(fontWeight, value) {
    expect(fontWeight.value()).toStrictEqual(value);

    const json = value;
    expect(fontWeight.toJson()).toStrictEqual(json);
    expect(fontWeight.toString()).toStrictEqual(json);

    expect(FontWeight.fromJson(fontWeight.toJson())).toStrictEqual(fontWeight);
}
