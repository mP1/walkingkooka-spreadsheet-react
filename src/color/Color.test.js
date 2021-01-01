import Color from "./Color";
import systemObjectTesting from "../SystemObjectTesting.js";

function text() {
    return "#123456";
}

function color() {
    return new Color(text());
}

systemObjectTesting(
    color(),
    new Color("#999999"),
    Color.fromJson,
    "Missing text",
    "color",
    text()
);

// create...............................................................................................................

test("create without text fails", () => {
    expect(() => new Color().toThrow("Missing text"));
});

test("create invalid text type fails", () => {
    const text = 123;
    expect(() => new Color(text)).toThrow("Expected string text got " + text);
});

test("create invalid string fails", () => {
    const text = "#rgb";
    expect(() => new Color(text)).toThrow("Expected string text #rrggbb got " + text);
});


test("create", () => {
    const t = text();
    check(new Color(t), t);
});

// fromJson.............................................................................................................

test("fromJson non string fails", () => {
    expect(() => Color.fromJson({})).toThrow("Expected string text got {}");
});

// equals...............................................................................................................

test("equals different text false", () => {
    expect(color()
        .equals(new Color("#987654")))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(color, text) {
    expect(color.text()).toStrictEqual(text);
}