import Text from "./Text";
import fromJson from "./TextNodeJsonSupport";
import TextStyle from "./TextStyle";
import React from "react";

const textValue = "text-123-abc";

test("create without text fails", () => {
    expect(() => new Text(null)).toThrow("Missing text");
});

test("create with non string fails", () => {
    expect(() => new Text(1.5)).toThrow("Expected string got 1.5");
});

test("create", () => {
    const text = new Text(textValue);
    expect(text.value()).toBe(textValue);
});

// render...............................................................................................................

test("render", () => {
    expect(new Text(textValue)
        .render())
        .toStrictEqual(textValue);
});

// render...............................................................................................................

test("json", () => {
    const text = new Text(textValue);

    check(text, {typeName: "text", value: textValue});
});

// helpers..............................................................................................................

function check(text, json) {
    expect(text.styles()).toStrictEqual(TextStyle.EMPTY);
    expect(text.toJson()).toStrictEqual(json);
    expect(text.toString()).toBe(JSON.stringify(json));
    expect(fromJson(text.toJson())).toStrictEqual(text);
}
