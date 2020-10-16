import Text from "./Text";
import TextPlaceholderNode from "./TextPlaceholderNode";
import fromJson from "./TextNodeJsonSupport";

const value = "text-placeholder-123-abc";

test("create", () => {
    const placeholder = new TextPlaceholderNode(value);
    expect(placeholder.value()).toBe(value);
});

test("json", () => {
    const placeholder = new TextPlaceholderNode(value);

    checkJson(placeholder, {typeName: "text-placeholder", value: value});
});

// helpers..............................................................................................................

// checks toJson and toString
function checkJson(placeholder, json) {
    expect(placeholder.toJson()).toStrictEqual(json);
    expect(placeholder.toString()).toBe(JSON.stringify(json));
    expect(fromJson(placeholder.toJson())).toStrictEqual(placeholder);
}
