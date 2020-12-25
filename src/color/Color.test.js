import Color from "./Color";

function text() {
    return "#123456";
}

function color() {
    return new Color(text());
}

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

test("fromJson undefined fails", () => {
    expect(() => Color.fromJson(undefined)).toThrow("Missing text");
});

test("fromJson null fails", () => {
    expect(() => Color.fromJson(null)).toThrow("Missing text");
});

test("fromJson non string fails", () => {
    expect(() => Color.fromJson({})).toThrow("Expected string text got {}");
});

test("fromJson", () => {
    const t = text();
    const color = Color.fromJson(t);
    check(color, t);
});

// toJson...............................................................................................................

test("toJson without color and text", () => {
    const t = text();

    expect(new Color(t)
        .toJson())
        .toStrictEqual(t);
});

// equals...............................................................................................................

test("equals undefined false", () => {
    expect(color()
        .equals())
        .toBeFalse();
});

test("equals null false", () => {
    expect(color()
        .equals(null))
        .toBeFalse();
});

test("equals different type false", () => {
    expect(color()
        .equals("different"))
        .toBeFalse();
});

test("equals self true", () => {
    const c = color();
    expect(c.equals(c))
        .toBeTrue();
});

test("equals different text false", () => {
    expect(color()
        .equals(new Color("#987654")))
        .toBeFalse();
});

// helpers..............................................................................................................

function check(color, text) {
    expect(color.text()).toStrictEqual(text);
}