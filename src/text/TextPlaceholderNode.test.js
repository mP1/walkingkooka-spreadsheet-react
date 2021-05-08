import TextPlaceholderNode from "./TextPlaceholderNode";
import TextStyle from "./TextStyle";
import textNodeJsonSupportFromJson from "./TextNodeJsonSupport";

const value = "text-placeholder-123-abc";

function placeholder() {
    return new TextPlaceholderNode(value);
}

test("create without text fails", () => {
    expect(() => new TextPlaceholderNode(null)).toThrow("Missing placeholder");
});

test("create with non string fails", () => {
    expect(() => new TextPlaceholderNode(1.5)).toThrow("Expected string placeholder got 1.5");
});

test("create", () => {
    const placeholder = new TextPlaceholderNode(value);
    expect(placeholder.value()).toBe(value);
});

// render...............................................................................................................

test("render fails", () => {
    expect(() => new TextPlaceholderNode(value).render()).toThrow("Unsupported: render");
});

// toJson...............................................................................................................

test("toJson", () => {
    const placeholder = new TextPlaceholderNode(value);

    check(placeholder, {type: "text-placeholder", value: value});
});

// equals...............................................................................................................

test("equals undefined false", () => {
    const p = placeholder();
    expect(p.equals()).toBeFalse();
});

test("equals null false", () => {
    const p = placeholder();
    expect(p.equals(null)).toBeFalse();
});

test("equals self true", () => {
    const p = placeholder();
    expect(p.equals(p)).toBeTrue();
});

test("equals different false", () => {
    const p = placeholder();
    expect(p.equals(new TextPlaceholderNode("different"))).toBeFalse();
});

test("equals equivalent true", () => {
    const p = placeholder();
    expect(p.equals(placeholder())).toBeTrue();
});

test("equals equivalent true #2", () => {
    const value = "placeholder-2";
    const p = new TextPlaceholderNode(value);
    expect(p.equals(new TextPlaceholderNode(value))).toBeTrue();
});

// helpers..............................................................................................................

function check(placeholder, json) {
    expect(placeholder.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(placeholder.toJson()).toStrictEqual(json);
    expect(placeholder.toString()).toBe(JSON.stringify(json));
    expect(textNodeJsonSupportFromJson(placeholder.toJson())).toStrictEqual(placeholder);
}
