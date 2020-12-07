import TextPlaceholderNode from "./TextPlaceholderNode";
import TextStyle from "./TextStyle";
import textNodeJsonSupportFromJson from "./TextNodeJsonSupport";

const value = "text-placeholder-123-abc";

function placeholder() {
    return new TextPlaceholderNode(value);
}

test("create without text fails", () => {
    expect(() => new TextPlaceholderNode(null)).toThrow("Missing text");
});

test("create with non string fails", () => {
    expect(() => new TextPlaceholderNode(1.5)).toThrow("Expected string got 1.5");
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
    expect(p.equals()).toBe(false);
});

test("equals null false", () => {
    const p = placeholder();
    expect(p.equals(null)).toBe(false);
});

test("equals self true", () => {
    const p = placeholder();
    expect(p.equals(p)).toBe(true);
});

test("equals different false", () => {
    const p = placeholder();
    expect(p.equals(new TextPlaceholderNode("different"))).toBe(false);
});

test("equals equivalent true", () => {
    const p = placeholder();
    expect(p.equals(placeholder())).toBe(true);
});

test("equals equivalent true #2", () => {
    const value = "placeholder-2";
    const p = new TextPlaceholderNode(value);
    expect(p.equals(new TextPlaceholderNode(value))).toBe(true);
});

// helpers..............................................................................................................

function check(placeholder, json) {
    expect(placeholder.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(placeholder.toJson()).toStrictEqual(json);
    expect(placeholder.toString()).toBe(JSON.stringify(json));
    expect(textNodeJsonSupportFromJson(placeholder.toJson())).toStrictEqual(placeholder);
}
