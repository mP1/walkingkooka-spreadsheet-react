import TextPlaceholderNode from "./TextPlaceholderNode";
import TextStyle from "./TextStyle";
import textNodeJsonSupportFromJson from "./TextNodeJsonSupport";

const value = "text-placeholder-123-abc";

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

// helpers..............................................................................................................

function check(placeholder, json) {
    expect(placeholder.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(placeholder.toJson()).toStrictEqual(json);
    expect(placeholder.toString()).toBe(JSON.stringify(json));
    expect(textNodeJsonSupportFromJson(placeholder.toJson())).toStrictEqual(placeholder);
}
