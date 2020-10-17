import Text from "./Text";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";
import {TextStyle} from "./TextStyle";

const value = "text-placeholder-123-abc";

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
