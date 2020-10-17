import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";
import {TextStyle} from "./TextStyle";

const value = "text-placeholder-123-abc";

test("create without text fails", () => {
    expect(() => new TextPlaceholderNode(null)).toThrow("text missing");
});

test("create with non string fails", () => {
    expect(() => new TextPlaceholderNode(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const placeholder = new TextPlaceholderNode(value);
    expect(placeholder.value()).toBe(value);
});

test("json", () => {
    const placeholder = new TextPlaceholderNode(value);

    check(placeholder, {typeName: "text-placeholder", value: value});
});

// helpers..............................................................................................................

function check(placeholder, json) {
    expect(placeholder.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(placeholder.toJson()).toStrictEqual(json);
    expect(placeholder.toString()).toBe(JSON.stringify(json));
    expect(fromJson(placeholder.toJson())).toStrictEqual(placeholder);
}
